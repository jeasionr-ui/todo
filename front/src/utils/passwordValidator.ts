import zxcvbn from 'zxcvbn';

/**
 * 密码强度等级
 */
export enum PasswordStrength {
  VeryWeak = 0,
  Weak = 1,
  Medium = 2,
  Strong = 3,
  VeryStrong = 4
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 包含密码强度信息的对象
 */
export function validatePasswordStrength(password: string) {
  const result = zxcvbn(password);
  
  return {
    score: result.score as PasswordStrength, // 0-4分，分数越高越安全
    feedback: {
      warning: result.feedback.warning,
      suggestions: result.feedback.suggestions
    },
    isValid: result.score >= PasswordStrength.Medium, // 至少需要中等强度
    crackTimeDisplay: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    // 返回可本地化的提示信息键
    strengthKey: getStrengthKey(result.score)
  };
}

/**
 * 获取密码强度对应的i18n翻译键
 * @param score 强度分数
 * @returns 对应的翻译键
 */
function getStrengthKey(score: number): string {
  switch (score) {
    case 0:
      return 'password.veryWeak';
    case 1:
      return 'password.weak';
    case 2:
      return 'password.medium';
    case 3:
      return 'password.strong';
    case 4:
      return 'password.veryStrong';
    default:
      return 'password.unknown';
  }
}

/**
 * 密码复杂性规则验证
 * @param password 密码
 * @returns 验证结果对象
 */
export function validatePasswordRules(password: string) {
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
    },
    requiredCount: 3, // 需要满足的规则数量（长度、数字、大小写、特殊字符）
    satisfiedCount: [hasMinLength, hasNumber, hasLowerCase, hasUpperCase, hasSpecialChar].filter(Boolean).length
  };
}

/**
 * 完整的密码验证
 * 综合考虑密码强度和复杂性规则
 * @param password 密码
 * @returns 验证结果
 */
export function validatePassword(password: string) {
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
