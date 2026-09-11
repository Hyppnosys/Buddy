export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'hotmail.com.br',
  'outlook.com',
  'outlook.com.br',
  'live.com',
  'live.com.br',
  'msn.com',
  'yahoo.com',
  'yahoo.com.br',
  'ymail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'yandex.com',
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
