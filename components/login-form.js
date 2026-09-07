"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { safeNext } from "../lib/safe-next.mjs";

const COOLDOWN_SECONDS = 60;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = window.setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const normalizedEmail = email.trim().toLowerCase();
  const nextPath = () => safeNext(new URLSearchParams(window.location.search).get("next"));

  async function requestCode(event) {
    event.preventDefault();
    if (busy || cooldown) return;
    setBusy(true);
    setState("Requesting a sign-in code…");
    try {
      await createClient().auth.signInWithOtp({ email: normalizedEmail, options: { shouldCreateUser: false } });
    } catch {
      // Keep the response generic so the address allowlist cannot be enumerated.
    } finally {
      setStep("code");
      setCooldown(COOLDOWN_SECONDS);
      setState("If this email is approved, a sign-in code has been sent.");
      setBusy(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    if (busy || !/^\d{6}$/.test(code)) return;
    setBusy(true);
    setState("Checking your code…");
    try {
      const { error } = await createClient().auth.verifyOtp({ email: normalizedEmail, token: code, type: "email" });
      if (error) {
        setState("That code could not be verified. Request a new code and try again.");
        return;
      }
      window.location.assign(nextPath());
    } catch {
      setState("Sign-in is temporarily unavailable. Try again shortly.");
    } finally {
      setBusy(false);
    }
  }

  return step === "email" ? <form className="stack" onSubmit={requestCode}>
    <label>Institutional email<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@institution.edu" /></label>
    <button className="button primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send sign-in code"}</button>
    <div role="status" aria-live="polite">{state}</div>
  </form> : <form className="stack" onSubmit={verifyCode}>
    <p className="form-note">Enter the six-digit code sent to this email. If you do not receive it, check your spam folder before requesting another.</p>
    <label>Six-digit sign-in code<input type="text" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
    <button className="button primary" type="submit" disabled={busy || code.length !== 6}>{busy ? "Checking…" : "Verify code"}</button>
    <div className="auth-actions"><button className="button quiet" type="button" onClick={() => { setStep("email"); setCode(""); setState(""); }}>Change email</button><button className="button quiet" type="button" disabled={busy || cooldown > 0} onClick={requestCode}>{cooldown ? `Resend in ${cooldown}s` : "Resend code"}</button></div>
    <div role="status" aria-live="polite">{state}</div>
  </form>;
}
