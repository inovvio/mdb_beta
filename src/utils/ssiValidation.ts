// SSI (Standard Settlement Instructions) validation utilities
import { SSIFormData } from '../schemas/ssiSchemas';

// SWIFT/BIC code validation
export function validateSwiftCode(swift: string): boolean {
  if (!swift) return false;
  
  // SWIFT/BIC format: 
  // - 4 letters: bank code
  // - 2 letters: country code
  // - 2 alphanumeric: location code
  // - Optional 3 alphanumeric: branch code
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(swift.toUpperCase());
}

// Account number validation
export function validateAccountNumber(account: string): boolean {
  if (!account) return false;

  // Basic validation rules:
  // - Only alphanumeric characters
  // - Length between 8 and 34 characters (IBAN max length)
  // - No special characters or spaces
  const accountRegex = /^[A-Z0-9]{8,34}$/;
  return accountRegex.test(account.toUpperCase());
}

// Format SWIFT code (remove spaces, convert to uppercase)
export function formatSwiftCode(swift: string): string {
  return swift.replace(/\s/g, '').toUpperCase();
}

// Comprehensive SSI validation
export function validateSSI(data: Partial<SSIFormData>): string[] {
  const errors: string[] = [];

  // Required fields validation
  if (!data.currency) {
    errors.push('Currency is required');
  }

  // Correspondent Bank validation
  if (!data.correspondentBank?.trim()) {
    errors.push('Correspondent bank name is required');
  }

  if (!data.correspondentSwift) {
    errors.push('Correspondent bank SWIFT code is required');
  } else if (!validateSwiftCode(data.correspondentSwift)) {
    errors.push('Invalid correspondent bank SWIFT code format');
  }

  // Intermediary Bank validation (optional)
  if (data.intermediaryBank && !data.intermediarySwift) {
    errors.push('Intermediary bank SWIFT code is required when intermediary bank is specified');
  }

  if (data.intermediarySwift && !validateSwiftCode(data.intermediarySwift)) {
    errors.push('Invalid intermediary bank SWIFT code format');
  }

  // Beneficiary Bank validation
  if (!data.beneficiaryBank?.trim()) {
    errors.push('Beneficiary bank name is required');
  }

  if (!data.beneficiarySwift) {
    errors.push('Beneficiary bank SWIFT code is required');
  } else if (!validateSwiftCode(data.beneficiarySwift)) {
    errors.push('Invalid beneficiary bank SWIFT code format');
  }

  // Beneficiary Account validation
  if (!data.beneficiaryAccount) {
    errors.push('Beneficiary account number is required');
  } else if (!validateAccountNumber(data.beneficiaryAccount)) {
    errors.push('Invalid beneficiary account number format');
  }

  // Beneficiary Name validation
  if (!data.beneficiaryName?.trim()) {
    errors.push('Beneficiary name is required');
  }

  // Special Instructions validation
  if (data.specialInstructions && data.specialInstructions.length > 500) {
    errors.push('Special instructions cannot exceed 500 characters');
  }

  // Currency-specific validations
  if (data.currency === 'EUR') {
    // For EUR payments, IBAN is typically required
    if (!data.beneficiaryAccount.match(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/)) {
      errors.push('Valid IBAN is required for EUR payments');
    }
  }

  // Routing validations
  if (data.intermediaryBank) {
    // Ensure routing chain makes sense
    if (data.correspondentSwift === data.intermediarySwift) {
      errors.push('Correspondent and intermediary bank cannot be the same');
    }
    if (data.intermediarySwift === data.beneficiarySwift) {
      errors.push('Intermediary and beneficiary bank cannot be the same');
    }
  }

  return errors;
}

// Additional helper functions
export function isValidRoutingChain(correspondent: string, intermediary: string | undefined, beneficiary: string): boolean {
  // Validate the routing chain makes sense
  if (!correspondent || !beneficiary) return false;
  if (correspondent === beneficiary) return false;
  if (intermediary) {
    if (correspondent === intermediary) return false;
    if (intermediary === beneficiary) return false;
  }
  return true;
}

export function validateBankName(name: string): boolean {
  // Basic bank name validation
  // - At least 2 characters
  // - Only letters, numbers, spaces, and common punctuation
  // - No excessive spaces
  const bankNameRegex = /^[A-Za-z0-9\s\-\.,&']{2,100}$/;
  return bankNameRegex.test(name.trim()) && !name.includes('  ');
}