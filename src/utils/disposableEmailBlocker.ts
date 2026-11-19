// src/utils/disposableEmailBlocker.ts
// Comprehensive blacklist of temporary/disposable/throwaway email providers to prevent bot quota abuse

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'guerrillamail.biz',
  'guerrillamail.de',
  'sharklasers.com',
  'grr.la',
  'spam4.me',
  '10minutemail.com',
  '10minutemail.net',
  '10minemail.com',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'dispostable.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'burnermail.io',
  'trashmail.com',
  'trashmail.net',
  'crazymailing.com',
  'mytemp.email',
  'generator.email',
  'emailondeck.com',
  'getnada.com',
  'inboxkitten.com',
  'maildrop.cc',
  'nada.ltd',
  'minuteinbox.com',
  'tempail.com',
  'dropmail.me',
  'tmail.io',
  'chacuo.net',
  '0-mail.com',
  'luxusmail.org',
  'disposablemail.com',
  'mytempmail.com',
  'tempinbox.com',
  'throwawayemailaddress.com',
  'spambox.us',
  'mailcatch.com',
  'meltmail.com',
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
