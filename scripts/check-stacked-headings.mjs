import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import net from "node:net";

const base = process.env.SU2QC_BASE_URL || "http://127.0.0.1:3000";
const routes = ["/", "/research", "/people", "/library", "/login", "/upload"];
const widths = [390, 768, 1024, 1440];
async function availablePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

const port = await availablePort();
const profile = await mkdtemp(`${process.cwd()}/.codex-tmp/layout-chrome-`);

async function waitFor(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try { return await (await fetch(url)).json(); } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  throw new Error(`Chrome DevTools did not start at ${url}`);
}

const chrome = spawn("google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
let socket;
try {
  const targets = await waitFor(`http://127.0.0.1:${port}/json/list`);
  const target = targets.find(item => item.type === "page");
  if (!target) throw new Error("Chrome did not expose a page target");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    }
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => (await command("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
  await command("Page.enable");
  await command("Runtime.enable");
  const failures = [];
  for (const width of widths) {
    await command("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await command("Page.navigate", { url: `${base}${route}` });
      for (let i = 0; i < 40 && !(await evaluate("document.readyState === 'complete'")); i += 1) await new Promise(resolve => setTimeout(resolve, 100));
      const result = await evaluate(`(() => {
        const pairs = [...document.querySelectorAll('[data-heading-description]')].map((node) => {
          const heading = node.querySelector('h1,h2,h3');
          const description = node.querySelector('p');
          const headingRect = heading?.getBoundingClientRect();
          const descriptionRect = description?.getBoundingClientRect();
          return { heading: heading?.textContent?.trim(), headingBottom: headingRect?.bottom, descriptionTop: descriptionRect?.top };
        });
        return { pairs, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
      })()`);
      for (const pair of result.pairs) if (pair.descriptionTop < pair.headingBottom - 1) failures.push({ width, route, issue: "description is not below heading", pair });
      if (result.overflow) failures.push({ width, route, issue: "horizontal overflow" });
      if (result.h1 !== 1) failures.push({ width, route, issue: `expected one h1, found ${result.h1}` });
    }
  }
  console.log(JSON.stringify({ base, routes, widths, failures }, null, 2));
  process.exitCode = failures.length ? 1 : 0;
} finally {
  socket?.close();
  await new Promise(resolve => {
    if (chrome.exitCode !== null) return resolve();
    chrome.once("close", resolve);
    chrome.kill("SIGTERM");
  });
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try { await rm(profile, { recursive: true, force: true }); break; }
    catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
}
