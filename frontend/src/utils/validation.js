// frontend/src/utils/validation.js

// ===== EMAIL VALIDATION =====
const ALLOWED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'zoho.com',
  'yandex.com'
];

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (email) => {
  if (!email) return false;
  if (!EMAIL_REGEX.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && ALLOWED_DOMAINS.includes(domain);
};

export const getAllowedDomainsMessage = () => {
  return `Please use a valid email from: ${ALLOWED_DOMAINS.join(', ')}`;
};

// ===== PASSWORD VALIDATION =====
export const isValidPassword = (password) => {
  // Must be at least 8 characters
  if (password.length < 8) return false;
  
  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Must contain at least one digit
  if (!/\d/.test(password)) return false;
  
  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  
  return true;
};

export const getPasswordRequirementsMessage = () => {
  return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
};