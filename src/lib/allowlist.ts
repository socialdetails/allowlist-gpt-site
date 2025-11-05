export function getAllowlist(): string[] {
  const raw = process.env.ALLOWLIST_EMAILS || '';
  return raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}
export function isAllowed(email: string): boolean {
  const list = getAllowlist();
  return list.includes(email.toLowerCase());
}
