/**
 * 登录相关工具函数
 */

/**
 * 获取客户端IP地址
 * @param {Object} req - Express请求对象
 * @returns {string} IP地址
 */
export function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.connection?.socket?.remoteAddress ||
         req.ip ||
         '127.0.0.1';
}

/**
 * 解析用户代理字符串，获取设备和浏览器信息
 * @param {string} userAgent - 用户代理字符串
 * @returns {Object} 设备和浏览器信息
 */
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      device: 'Unknown Device',
      browser: 'Unknown Browser',
      os: 'Unknown OS'
    };
  }

  // 检测操作系统
  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  // 检测浏览器
  let browser = 'Unknown Browser';
  if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
  }

  // 检测设备类型
  let device = 'Desktop';
  if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    device = 'Tablet';
  }

  return {
    device: `${device} (${os})`,
    browser,
    os
  };
}

/**
 * 获取地理位置信息（简化版，实际项目中可以使用IP定位服务）
 * @param {string} ip - IP地址
 * @returns {Promise<string>} 地理位置
 */
export async function getLocationFromIP(ip) {
  // 这里是一个简化的实现，实际项目中应该调用IP定位服务
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'Local Network';
  }
  
  // 实际项目中可以使用以下服务：
  // - ipapi.co
  // - ipgeolocation.io
  // - ip-api.com
  // 这里返回默认值
  return 'Unknown Location';
}

/**
 * 创建登录历史记录
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 登录历史记录
 */
export async function createLoginRecord(req) {
  const ip = getClientIP(req);
  const userAgentInfo = parseUserAgent(req.headers['user-agent']);
  const location = await getLocationFromIP(ip);
  
  return {
    id: Date.now().toString(), // 简单的ID生成，实际项目中可以使用UUID
    device: userAgentInfo.device,
    browser: userAgentInfo.browser,
    os: userAgentInfo.os,
    ipAddress: ip,
    location: location,
    time: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || ''
  };
}
