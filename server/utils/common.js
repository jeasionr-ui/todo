/**
 * 通用工具函数
 */

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  if (!date) return null;
  if (typeof date === 'string') return date;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDateTime(date) {
  if (!date) return null;
  if (typeof date === 'string') return date;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 检查是否为有效的日期
 * @param {any} date 要检查的值
 * @returns {boolean} 是否为有效日期
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 解析日期字符串为Date对象
 * @param {string} dateString 日期字符串
 * @returns {Date|null} 日期对象或null
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
}

/**
 * 获取两个日期之间的天数差
 * @param {Date|string} date1 第一个日期
 * @param {Date|string} date2 第二个日期
 * @returns {number} 天数差
 */
export function getDaysDifference(date1, date2) {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  if (!isValidDate(d1) || !isValidDate(d2)) return 0;
  
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * 获取今天的日期字符串
 * @returns {string} 今天的日期字符串 (YYYY-MM-DD)
 */
export function getTodayString() {
  return formatDate(new Date());
}
