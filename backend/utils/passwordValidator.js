import zxcvbn from 'zxcvbn';

/**
 * 密码强度等级
 */
export const PasswordStrength = {
  VeryWeak: 0,
  Weak: 1,
  Medium: 2,
  Strong: 3,
  VeryStrong: 4
};

/**
 * 验证密码强度
 * @param {string} password 密码
 * @returns {Object} 包含密码强度信息的对象
 */
export function validatePasswordStrength(password) {
  const result = zxcvbn(password);
  
  return {
    score: result.score, // 0-4分，分数越高越安全
    feedback: {
      warning: result.feedback.warning,
      suggestions: result.feedback.suggestions
    },
    isValid: result.score >= PasswordStrength.Medium, // 至少需要中等强度
    crackTimeDisplay: result.crack_times_display.offline_slow_hashing_1e4_per_second
  };
}

/**
 * 密码复杂性规则验证
 * @param {string} password 密码
 * @returns {Object} 验证结果对象
 */
export function validatePasswordRules(password) {
  // 最小长度要求
  const minLength = 8;
  const hasMinLength = password.length >= minLength;
  
  // 包含至少一个数字
  const hasNumber = /\d/.test(password);
  
  // 包含至少一个小写字母
  const hasLowerCase = /[a-z]/.test(password);
  
  // 包含至少一个大写字母
  const hasUpperCase = /[A-Z]/.test(password);
  
  // 包含至少一个特殊字符
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // 是否有连续重复字符
  const hasRepeatingChars = /(.)\1{2,}/.test(password); // 例如 "aaa"
  
  // 总体验证结果
  const isValid = 
    hasMinLength && 
    hasNumber && 
    ((hasLowerCase && hasUpperCase) || hasSpecialChar) && 
    !hasRepeatingChars;
  
  return {
    isValid,
    rules: {
      hasMinLength,
      hasNumber,
      hasLowerCase,
      hasUpperCase,
      hasSpecialChar,
      hasNoRepeatingChars: !hasRepeatingChars
    }
  };
}

/**
 * 完整的密码验证
 * 综合考虑密码强度和复杂性规则
 * @param {string} password 密码
 * @returns {Object} 验证结果
 */
export function validatePassword(password) {
  const strengthResult = validatePasswordStrength(password);
  const rulesResult = validatePasswordRules(password);
  
  // 密码必须同时满足强度和复杂性要求
  const isValid = strengthResult.isValid && rulesResult.isValid;
  
  return {
    ...strengthResult,
    ...rulesResult,
    isValid
  };
}
