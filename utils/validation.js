// Validation Utility for Form Inputs and Authentication

/**
 * Email validation
 * Checks for valid email format
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Additional checks for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = trimmedEmail.split('@')[1];
  
  // Check for common typos
  const typoPatterns = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
  };

  if (typoPatterns[domain]) {
    return { 
      isValid: true, 
      warning: `Did you mean ${trimmedEmail.split('@')[0]}@${typoPatterns[domain]}?`,
      value: trimmedEmail 
    };
  }

  return { isValid: true, value: trimmedEmail };
};

/**
 * Password validation
 * Checks password strength and requirements
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false, 
      error: `Password must be at least ${minLength} characters long` 
    };
  }

  const checks = [];
  let strength = 0;

  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) {
    checks.push('one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    strength += 1;
  }

  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) {
    checks.push('one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    strength += 1;
  }

  // Check for numbers
  if (requireNumbers && !/[0-9]/.test(password)) {
    checks.push('one number');
  } else if (/[0-9]/.test(password)) {
    strength += 1;
  }

  // Check for special characters
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    checks.push('one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  }

  // Check password length for strength
  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;

  if (checks.length > 0) {
    return { 
      isValid: false, 
      error: `Password must contain at least ${checks.join(', ')}` 
    };
  }

  // Calculate password strength
  let strengthLevel = 'weak';
  if (strength >= 5) strengthLevel = 'strong';
  else if (strength >= 3) strengthLevel = 'medium';

  return { 
    isValid: true, 
    strength: strengthLevel,
    score: strength 
  };
};

/**
 * Password match validation
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Common password check
 * Checks against list of common/weak passwords
 */
const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master',
  'sunshine', 'ashley', 'bailey', 'shadow', 'superman', 'password1',
  '123456789', '12345', '1234567', 'password123', '1234567890'
];

export const isCommonPassword = (password) => {
  const lowerPassword = password.toLowerCase();
  return commonPasswords.some(common => lowerPassword.includes(common));
};

/**
 * Full password validation with common password check
 */
export const validatePasswordStrength = (password) => {
  const validation = validatePassword(password, {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  });

  if (!validation.isValid) {
    return validation;
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    return { 
      isValid: false, 
      error: 'This password is too common. Please choose a stronger password' 
    };
  }

  return validation;
};

/**
 * Name validation
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name || !name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least 2 characters long` 
    };
  }

  if (trimmedName.length > 50) {
    return { 
      isValid: false, 
      error: `${fieldName} must be less than 50 characters` 
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    return { 
      isValid: false, 
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` 
    };
  }

  return { isValid: true, value: trimmedName };
};

/**
 * Habit name validation
 */
export const validateHabitName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Habit name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { 
      isValid: false, 
      error: 'Habit name must be at least 3 characters long' 
    };
  }

  if (trimmedName.length > 50) {
    return { 
      isValid: false, 
      error: 'Habit name must be less than 50 characters' 
    };
  }

  return { isValid: true, value: trimmedName };
};

/**
 * Habit description validation
 */
export const validateHabitDescription = (description) => {
  if (!description) {
    return { isValid: true, value: '' };
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription.length > 200) {
    return { 
      isValid: false, 
      error: 'Description must be less than 200 characters' 
    };
  }

  return { isValid: true, value: trimmedDescription };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Form validation helper
 * Validates multiple fields at once
 */
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach(fieldName => {
    const { value, validator, required = true } = fields[fieldName];
    
    if (required && (!value || !value.trim())) {
      errors[fieldName] = `${fieldName} is required`;
      isValid = false;
    } else if (validator && value) {
      const result = validator(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * Real-time password strength indicator
 */
export const getPasswordStrengthInfo = (password) => {
  if (!password) {
    return { strength: 'none', color: '#94a3b8', text: '', percentage: 0 };
  }

  const validation = validatePassword(password, {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  });

  const score = validation.score || 0;
  
  if (score === 0) {
    return { 
      strength: 'very weak', 
      color: '#ef4444', 
      text: 'Very Weak', 
      percentage: 20 
    };
  } else if (score <= 2) {
    return { 
      strength: 'weak', 
      color: '#f59e0b', 
      text: 'Weak', 
      percentage: 40 
    };
  } else if (score <= 4) {
    return { 
      strength: 'medium', 
      color: '#3b82f6', 
      text: 'Medium', 
      percentage: 60 
    };
  } else if (score <= 5) {
    return { 
      strength: 'strong', 
      color: '#22c55e', 
      text: 'Strong', 
      percentage: 80 
    };
  } else {
    return { 
      strength: 'very strong', 
      color: '#10b981', 
      text: 'Very Strong', 
      percentage: 100 
    };
  }
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePasswordStrength,
  validateName,
  validateHabitName,
  validateHabitDescription,
  sanitizeInput,
  validateForm,
  getPasswordStrengthInfo,
  isCommonPassword,
};
