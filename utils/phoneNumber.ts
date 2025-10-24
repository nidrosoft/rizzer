/**
 * Phone Number Utilities
 * Handles E.164 formatting and validation according to Twilio requirements
 */

export interface Country {
  code: string;
  country: string;
  name: string;
  flag: string;
  minLength: number;
  maxLength: number;
}

// Enhanced country data with validation rules
export const COUNTRIES: Country[] = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦', minLength: 10, maxLength: 10 },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵', minLength: 10, maxLength: 11 },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 12 },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹', minLength: 9, maxLength: 10 },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { code: '+7', country: 'RU', name: 'Russia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷', minLength: 9, maxLength: 11 },
  { code: '+93', country: 'AF', name: 'Afghanistan', flag: '🇦🇫', minLength: 8, maxLength: 9 },
  { code: '+355', country: 'AL', name: 'Albania', flag: '🇦🇱', minLength: 8, maxLength: 9 },
  { code: '+213', country: 'DZ', name: 'Algeria', flag: '🇩🇿', minLength: 8, maxLength: 9 },
  { code: '+376', country: 'AD', name: 'Andorra', flag: '🇦🇩', minLength: 6, maxLength: 6 },
  { code: '+244', country: 'AO', name: 'Angola', flag: '🇦🇴', minLength: 9, maxLength: 9 },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷', minLength: 10, maxLength: 10 },
  { code: '+374', country: 'AM', name: 'Armenia', flag: '🇦🇲', minLength: 8, maxLength: 8 },
];

/**
 * Sanitize phone number input - remove all non-digit characters
 */
export function sanitizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

/**
 * Remove leading zeros from phone number
 */
export function removeLeadingZeros(phoneNumber: string): string {
  return phoneNumber.replace(/^0+/, '');
}

/**
 * Format phone number for display (with spaces/dashes for readability)
 */
export function formatPhoneDisplay(phoneNumber: string, country: Country): string {
  const cleaned = sanitizePhoneNumber(phoneNumber);
  const withoutLeadingZeros = removeLeadingZeros(cleaned);
  
  // Country-specific formatting
  switch (country.country) {
    case 'US':
    case 'CA':
      if (withoutLeadingZeros.length === 10) {
        return `(${withoutLeadingZeros.slice(0, 3)}) ${withoutLeadingZeros.slice(3, 6)}-${withoutLeadingZeros.slice(6)}`;
      }
      break;
    case 'GB':
      if (withoutLeadingZeros.length === 10) {
        return `${withoutLeadingZeros.slice(0, 4)} ${withoutLeadingZeros.slice(4, 7)} ${withoutLeadingZeros.slice(7)}`;
      }
      break;
    default:
      // Default formatting - add spaces every 3 digits
      return withoutLeadingZeros.replace(/(\d{3})(?=\d)/g, '$1 ');
  }
  
  return withoutLeadingZeros;
}

/**
 * Convert phone number to E.164 format
 */
export function toE164Format(phoneNumber: string, country: Country): string {
  const cleaned = sanitizePhoneNumber(phoneNumber);
  const withoutLeadingZeros = removeLeadingZeros(cleaned);
  
  // Validate length
  if (withoutLeadingZeros.length < country.minLength || withoutLeadingZeros.length > country.maxLength) {
    throw new Error(`Phone number must be ${country.minLength}-${country.maxLength} digits for ${country.name}`);
  }
  
  // Return in E.164 format: +[country code][subscriber number]
  return `${country.code}${withoutLeadingZeros}`;
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phoneNumber: string, country: Country): { isValid: boolean; error?: string } {
  const cleaned = sanitizePhoneNumber(phoneNumber);
  const withoutLeadingZeros = removeLeadingZeros(cleaned);
  
  if (withoutLeadingZeros.length === 0) {
    return { isValid: false, error: 'Please enter a phone number' };
  }
  
  if (withoutLeadingZeros.length < country.minLength) {
    return { isValid: false, error: `Phone number must be at least ${country.minLength} digits` };
  }
  
  if (withoutLeadingZeros.length > country.maxLength) {
    return { isValid: false, error: `Phone number must be no more than ${country.maxLength} digits` };
  }
  
  // Check for invalid characters (should only be digits after sanitization)
  if (!/^\d+$/.test(withoutLeadingZeros)) {
    return { isValid: false, error: 'Phone number can only contain digits' };
  }
  
  return { isValid: true };
}

/**
 * Get country by country code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

/**
 * Get country by country identifier
 */
export function getCountryById(countryId: string): Country | undefined {
  return COUNTRIES.find(country => country.country === countryId);
}

/**
 * Parse E.164 formatted number to extract country and local number
 */
export function parseE164Number(e164Number: string): { country: Country | null; localNumber: string } {
  // Remove + if present
  const cleanNumber = e164Number.replace(/^\+/, '');
  
  // Find matching country by code
  for (const country of COUNTRIES) {
    const countryCode = country.code.replace('+', '');
    if (cleanNumber.startsWith(countryCode)) {
      const localNumber = cleanNumber.substring(countryCode.length);
      return { country, localNumber };
    }
  }
  
  return { country: null, localNumber: cleanNumber };
}

/**
 * Validate E.164 format
 */
export function validateE164Format(phoneNumber: string): boolean {
  // E.164 format: +[country code][subscriber number] (max 15 digits total)
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}
