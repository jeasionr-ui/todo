import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'; // 与认证业务层使用相同的密钥

export function verifyToken(req, res, next) {
  // 获取认证头
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  // 从头部获取令牌
  const token = authHeader.split(' ')[1];
  
  try {
    // 验证令牌
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // 添加已验证的用户到请求对象
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function createToken(userInfo) {
  // 创建JWT令牌，7天有效期
  return jwt.sign(userInfo, JWT_SECRET, { expiresIn: '7d' });
}
