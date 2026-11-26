'use strict';

const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;
const LOCAL_PART_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
const DOMAIN_LABEL_PATTERN = /^[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/i;
const PHONE_CHARACTERS_PATTERN = /^[+\d().\s-]+$/;
const ALLOWED_INTERESTS = new Set([
  'avaliacao',
  'implantes',
  'lentes',
  'alinhadores',
  'outro',
]);

/** Remove markup delimiters and control characters before validating user input. */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return '';

  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 254);
}

export function isValidName(value) {
  const name = sanitizeInput(value);
  return name.length >= 2 && name.length <= 80 && NAME_PATTERN.test(name);
}

export function isValidEmail(value) {
  const email = sanitizeInput(value);
  if (email.length > 254 || (email.match(/@/g) || []).length !== 1) return false;

  const [localPart, domain] = email.split('@');
  if (
    localPart.length < 1 ||
    localPart.length > 64 ||
    !LOCAL_PART_PATTERN.test(localPart) ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..')
  ) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL_PATTERN.test(label))) return false;

  const topLevelDomain = labels[labels.length - 1];
  return topLevelDomain.length >= 2 && /^[A-Z]{2,63}$/i.test(topLevelDomain);
}

export function isValidBrazilianPhone(value) {
  const phone = sanitizeInput(value);
  if (!phone || !PHONE_CHARACTERS_PATTERN.test(phone)) return false;
  if (phone.startsWith('+') && !phone.startsWith('+55')) return false;

  let digits = phone.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  if (digits.length !== 10 && digits.length !== 11) return false;

  const areaCode = Number(digits.slice(0, 2));
  const subscriberNumber = digits.slice(2);
  if (areaCode < 11 || areaCode > 99) return false;

  return subscriberNumber.length === 9
    ? /^9\d{8}$/.test(subscriberNumber)
    : /^[2-5]\d{7}$/.test(subscriberNumber);
}

export function isValidInterest(value) {
  return ALLOWED_INTERESTS.has(sanitizeInput(value));
}

/**
 * Local-only service simulation. Replace this with a same-origin backend endpoint;
 * API credentials must exist exclusively in that server environment.
 */
export async function submitAppointmentRequest(lead) {
  const safeLead = {
    name: sanitizeInput(lead?.name),
    phone: sanitizeInput(lead?.phone),
    email: sanitizeInput(lead?.email),
    interest: sanitizeInput(lead?.interest),
  };

  if (
    !isValidName(safeLead.name) ||
    !isValidBrazilianPhone(safeLead.phone) ||
    !isValidEmail(safeLead.email) ||
    !isValidInterest(safeLead.interest)
  ) {
    throw new Error('Invalid appointment request');
  }

  // This intentionally does not transmit, log, or persist personal information.
  await new Promise((resolve) => window.setTimeout(resolve, 550));
  return { ok: true, simulated: true };
}