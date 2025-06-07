import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

async function clearActiveSessions() {
  try {
    // Login first
    const loginResult = await axios.post(BASE_URL + '/auth/login', {
      email: 'pomodoro.test@example.com',
      password: 'test123456'
    });

    console.log('登录响应:', JSON.stringify(loginResult.data, null, 2));
    
    if (!loginResult.data.token) {
      console.log('❌ 无法获取token');
      return;
    }

    const token = loginResult.data.token;
    console.log('🔐 登录成功, token:', token ? '已获取' : '未获取');

    // Check for active sessions
    try {
      const activeResult = await axios.get(BASE_URL + '/pomodoro/sessions/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (activeResult.data.success) {
        console.log('🔍 发现活跃会话:', activeResult.data.data.id);
        
        // Cancel the active session
        const cancelResult = await axios.post(BASE_URL + `/pomodoro/sessions/${activeResult.data.data.id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ 会话取消结果:', cancelResult.data.success ? '成功' : '失败');
      } else {
        console.log('ℹ️  没有发现活跃会话');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  没有活跃会话 (404)');
      } else {
        console.log('❌ 检查活跃会话时出错:', error.response?.data || error.message);
      }
    }
  } catch (error) {
    console.error('❌ 清理会话失败:', error.response?.data || error.message);
  }
}

// Run the function
clearActiveSessions();
