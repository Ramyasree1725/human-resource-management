/**
 * Enterprise Form Validation Rules & Pattern Checkers
 * Validates Indian statutory IDs, banking protocols, tax identifiers,
 * phone formatting, and email syntax.
 */

// Verhoeff Algorithm for Aadhaar Checksum Validation
const VERHOEFF_D_TABLE = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const VERHOEFF_P_TABLE = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

export class FormValidationRules {
  static validatePAN(pan) {
    if (!pan) return { isValid: false, message: 'PAN number is required' };
    const cleanPAN = String(pan).trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPAN)) {
      return { isValid: false, message: 'Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)' };
    }
    const fourthChar = cleanPAN.charAt(3);
    const validEntities = ['P', 'C', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'];
    if (!validEntities.includes(fourthChar)) {
      return { isValid: false, message: `Invalid PAN status holder code '${fourthChar}'` };
    }
    return { isValid: true, cleanValue: cleanPAN };
  }

  static validateAadhaar(aadhaar) {
    if (!aadhaar) return { isValid: false, message: 'Aadhaar number is required' };
    const cleanAadhaar = String(aadhaar).replace(/[\s-]+/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return { isValid: false, message: 'Aadhaar must be exactly 12 numeric digits' };
    }
    if (/^([0-1])\1{11}$/.test(cleanAadhaar)) {
      return { isValid: false, message: 'Invalid Aadhaar sequence' };
    }

    // Validate using Verhoeff algorithm
    let c = 0;
    const reversedArray = cleanAadhaar.split('').map(Number).reverse();
    for (let i = 0; i < reversedArray.length; i++) {
      c = VERHOEFF_D_TABLE[c][VERHOEFF_P_TABLE[i % 8][reversedArray[i]]];
    }
    const isValid = c === 0;
    return {
      isValid,
      message: isValid ? '' : 'Invalid Aadhaar checksum digit',
      formattedValue: `${cleanAadhaar.slice(0, 4)} ${cleanAadhaar.slice(4, 8)} ${cleanAadhaar.slice(8, 12)}`
    };
  }

  static validateIFSC(ifsc) {
    if (!ifsc) return { isValid: false, message: 'Bank IFSC code is required' };
    const cleanIFSC = String(ifsc).trim().toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(cleanIFSC)) {
      return { isValid: false, message: 'Invalid IFSC format. Must be 4 letters, zero (0), and 6 alphanumeric digits (e.g. HDFC0001234)' };
    }
    return { isValid: true, cleanValue: cleanIFSC };
  }

  static validateUAN(uan) {
    if (!uan) return { isValid: true }; // optional
    const cleanUAN = String(uan).trim();
    if (!/^\d{12}$/.test(cleanUAN)) {
      return { isValid: false, message: 'Universal Account Number (UAN) must be 12 numeric digits' };
    }
    return { isValid: true, cleanValue: cleanUAN };
  }

  static validateBankAccount(accountNo) {
    if (!accountNo) return { isValid: false, message: 'Bank Account Number is required' };
    const cleanAcc = String(accountNo).trim();
    if (!/^\d{9,18}$/.test(cleanAcc)) {
      return { isValid: false, message: 'Account number must be between 9 and 18 numeric digits' };
    }
    return { isValid: true, cleanValue: cleanAcc };
  }

  static validateEmail(email) {
    if (!email) return { isValid: false, message: 'Email address is required' };
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(String(email).trim())) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, cleanValue: String(email).trim().toLowerCase() };
  }

  static validateIndianMobile(phone) {
    if (!phone) return { isValid: false, message: 'Phone number is required' };
    const clean = String(phone).replace(/[\s-+()]/g, '');
    const mobileWithoutCode = clean.length > 10 && clean.startsWith('91') ? clean.slice(2) : clean;
    if (!/^[6-9]\d{9}$/.test(mobileWithoutCode)) {
      return { isValid: false, message: 'Must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9' };
    }
    return { isValid: true, formattedValue: `+91 ${mobileWithoutCode.slice(0, 5)} ${mobileWithoutCode.slice(5)}` };
  }

  static validateSalaryCTC(salary) {
    const num = Number(salary);
    if (isNaN(num) || num <= 0) {
      return { isValid: false, message: 'Salary must be a positive number' };
    }
    if (num < 100000) {
      return { isValid: false, message: 'Annual CTC cannot be less than minimum wage (₹1,00,000)' };
    }
    if (num > 100000000) {
      return { isValid: false, message: 'Annual CTC exceeds maximum system ceiling' };
    }
    return { isValid: true, value: Math.round(num) };
  }
}
