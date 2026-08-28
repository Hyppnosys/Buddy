/**
 * Only e-mails from these providers are accepted. This intentionally blocks
 * made-up or throwaway domains (e.g. "user@kkk.com") — the goal is to only
 * allow addresses from real, well-known e-mail services.
 *
 * Add more here if a legitimate provider is missing; no other code needs
 * to change.
 */
export const ALLOWED_EMAIL_DOMAINS = [
  // Google
  'gmail.com',
  'googlemail.com',
  // Microsoft
  'hotmail.com',
  'hotmail.com.br',
  'outlook.com',
  'outlook.com.br',
  'live.com',
  'live.com.br',
  'msn.com',
  // Yahoo
  'yahoo.com',
  'yahoo.com.br',
  'ymail.com',
  // Apple
  'icloud.com',
  'me.com',
  'mac.com',
  // Other well-known providers
  'aol.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'yandex.com',
  // Common Brazilian providers
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'ig.com.br',
  'globo.com',
  'globomail.com',
  'r7.com',
  'oi.com.br',
] as const;

export function getEmailDomain(email: string): string {
  return email.trim().toLowerCase().split('@').pop() ?? '';
}

export function isAllowedEmailDomain(email: string): boolean {
  const domain = getEmailDomain(email);
  return (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain);
}
