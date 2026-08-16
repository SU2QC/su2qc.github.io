export function isMissingAuthSession(error) {
  return error?.name === "AuthSessionMissingError"
    || error?.code === "session_not_found"
    || error?.code === "refresh_token_not_found"
    || /invalid refresh token/i.test(error?.message || "")
    || /auth session missing/i.test(error?.message || "");
}
