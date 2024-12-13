import { z } from 'zod';
import { CURRENCIES } from '../utils/constants';

export const ssiSchema = z.object({
  currency: z.enum(CURRENCIES as [string, ...string[]], {
    required_error: 'Currency is required'
  }),
  correspondentBank: z.string()
    .min(1, 'Correspondent bank is required')
    .max(100, 'Correspondent bank name is too long'),
  correspondentSwift: z.string()
    .min(8, 'SWIFT code must be 8 or 11 characters')
    .max(11, 'SWIFT code must be 8 or 11 characters')
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code format'),
  intermediaryBank: z.string().optional(),
  intermediarySwift: z.string()
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code format')
    .optional(),
  beneficiaryBank: z.string()
    .min(1, 'Beneficiary bank is required')
    .max(100, 'Beneficiary bank name is too long'),
  beneficiarySwift: z.string()
    .min(8, 'SWIFT code must be 8 or 11 characters')
    .max(11, 'SWIFT code must be 8 or 11 characters')
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code format'),
  beneficiaryAccount: z.string()
    .min(1, 'Beneficiary account is required')
    .max(34, 'Account number cannot exceed 34 characters')
    .regex(/^[A-Z0-9]+$/, 'Account number can only contain letters and numbers'),
  beneficiaryName: z.string()
    .min(1, 'Beneficiary name is required')
    .max(100, 'Beneficiary name is too long'),
  specialInstructions: z.string()
    .max(500, 'Special instructions cannot exceed 500 characters')
    .optional(),
  isPrimary: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export type SSIFormData = z.infer<typeof ssiSchema>;

// Additional validation functions
export const validateSwiftCode = (swift: string): boolean => {
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(swift);
};

export const validateIBAN = (iban: string): boolean => {
  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic IBAN format check
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4,}$/;
  if (!ibanRegex.test(cleanIBAN)) {
    return false;
  }

  // Move first 4 characters to end and convert letters to numbers
  const rearranged = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);
  const converted = rearranged.split('').map(char => {
    if (/[0-9]/.test(char)) return char;
    return (char.charCodeAt(0) - 55).toString();
  }).join('');

  // Calculate modulus
  let remainder = '';
  for (let i = 0; i < converted.length; i++) {
    remainder = (parseInt(remainder + converted[i]) % 97).toString();
  }

  return parseInt(remainder) === 1;
};

export const validateAccountNumber = (accountNumber: string): boolean => {
  // Basic account number validation
  const accountRegex = /^[A-Z0-9]+$/;
  return accountRegex.test(accountNumber) && accountNumber.length <= 34;
};