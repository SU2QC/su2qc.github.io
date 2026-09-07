export async function resolveActiveMember(client, email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;
  const { data: alias, error: aliasError } = await client.from("member_emails").select("member_id,active").eq("email", normalized).eq("active", true).maybeSingle();
  if (aliasError) throw aliasError;
  let memberId = alias?.member_id;
  if (!memberId) {
    const { data: legacy, error: legacyError } = await client.from("members").select("id").eq("email", normalized).eq("active", true).maybeSingle();
    if (legacyError) throw legacyError;
    memberId = legacy?.id;
  }
  if (!memberId) return null;
  const { data: member, error } = await client.from("members").select("id,display_name,role,active").eq("id", memberId).eq("active", true).maybeSingle();
  if (error) throw error;
  return member || null;
}

export function canManage(member, ownerId) { return Boolean(member && (member.role === "admin" || member.id === ownerId)); }
