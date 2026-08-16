const clean = value => value.trim().replace(/\s+/g, " ");

function readValue(body, start) {
  const opener = body[start];
  if (opener === "{") {
    let depth = 1;
    let index = start + 1;
    while (index < body.length && depth) {
      if (body[index] === "{") depth += 1;
      if (body[index] === "}") depth -= 1;
      index += 1;
    }
    if (depth) throw new Error("BibTeX has an unclosed braced field.");
    return [body.slice(start + 1, index - 1), index];
  }
  if (opener === '"') {
    let index = start + 1;
    while (index < body.length) {
      if (body[index] === '"' && body[index - 1] !== "\\") return [body.slice(start + 1, index), index + 1];
      index += 1;
    }
    throw new Error("BibTeX has an unclosed quoted field.");
  }
  const end = body.indexOf(",", start);
  return [body.slice(start, end < 0 ? body.length : end), end < 0 ? body.length : end];
}

export function parseBibTeX(input) {
  const head = input.match(/^\s*@([a-zA-Z]+)\s*\{\s*([^,]+),/);
  if (!head) throw new Error("BibTeX must begin with @type{citation-key,");
  const fields = { type: head[1].toLowerCase(), key: head[2].trim() };
  const body = input.slice(head[0].length).replace(/}\s*$/, "");
  let index = 0;
  while (index < body.length) {
    while (/[\s,]/.test(body[index] || "")) index += 1;
    if (index >= body.length) break;
    const name = body.slice(index).match(/^[a-zA-Z][\w-]*/);
    if (!name) throw new Error("BibTeX contains an invalid field name.");
    index += name[0].length;
    while (/\s/.test(body[index] || "")) index += 1;
    if (body[index] !== "=") throw new Error(`BibTeX field ${name[0]} is missing '='.`);
    index += 1;
    while (/\s/.test(body[index] || "")) index += 1;
    const [value, next] = readValue(body, index);
    fields[name[0].toLowerCase()] = clean(value);
    index = next;
  }
  if (!fields.title || !fields.author) throw new Error("BibTeX requires author and title fields.");
  fields.authors = fields.author.split(/\s+and\s+/i).map(clean);
  return fields;
}
