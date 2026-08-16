"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { safeNext } from "../lib/safe-next.mjs";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");

  async function submit(event) {
    event.preventDefault();
    setState("Signing in…");

    try {
      const { error } = await createClient().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setState("Sign-in failed. Check your credentials or contact a SU2QC administrator.");
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(safeNext(next));
    } catch {
      setState("Sign-in is temporarily unavailable. Try again shortly.");
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <label>
        Institutional email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@institution.edu"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <button className="button primary" type="submit">
        Sign in
      </button>

      <div role="status" aria-live="polite">{state}</div>
    </form>
  );
}
