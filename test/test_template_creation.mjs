#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// 测试用户信息
const testUser = {
  email: 'pomodoro.test@example.com',
  password: 'test123456'
};

async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    
    const axiosOptions = {
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: options.body ? JSON.parse(options.body) : undefined
    };

    const response = await axios(axiosOptions);
    
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        error: `HTTP ${error.response.status}: ${JSON.stringify(error.response.data, null, 2)}` 
      };
    }
    return { success: false, error: error.message };
  }
}

async function testTemplateCreation() {
  console.log('🧪 测试模板创建功能');
  
  // 1. 登录获取 token
  console.log('\n步骤 1: 登录');
  const loginResult = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  if (!loginResult.success) {
    console.error('❌ 登录失败:', loginResult.error);
    return;
  }
  
  const token = loginResult.data.token;
  console.log('✅ 登录成功');

  // 2. 测试简单模板创建
  console.log('\n步骤 2: 创建简单模板');
  const simpleTemplate = {
    name: '简单测试模板',
    description: '最基础的模板测试',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    roundsBeforeLongBreak: 4
  };

  const result1 = await apiRequest('/pomodoro/templates', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(simpleTemplate)
  });

  if (result1.success) {
    console.log('✅ 简单模板创建成功:', result1.data);
  } else {
    console.error('❌ 简单模板创建失败:', result1.error);
  }

  // 3. 测试完整模板创建
  console.log('\n步骤 3: 创建完整模板');
  const fullTemplate = {
    name: '完整测试模板',
    description: '包含所有字段的模板测试',
    workDuration: 1,
    shortBreakDuration: 1,
    longBreakDuration: 2,
    roundsBeforeLongBreak: 4,
    autoStartBreak: true,
    autoStartWork: false,
    enableNotifications: true,
    enableSounds: true,
    focusMode: false,
    isDefault: false
  };

  const result2 = await apiRequest('/pomodoro/templates', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(fullTemplate)
  });

  if (result2.success) {
    console.log('✅ 完整模板创建成功:', result2.data);
  } else {
    console.error('❌ 完整模板创建失败:', result2.error);
  }

  // 4. 测试边界值
  console.log('\n步骤 4: 测试边界值');
  const edgeTemplate = {
    name: 'A', // 最短名称
    workDuration: 1, // 最短工作时间
    shortBreakDuration: 1, // 最短短休息
    longBreakDuration: 1, // 最短长休息
    roundsBeforeLongBreak: 1 // 最少轮数
  };

  const result3 = await apiRequest('/pomodoro/templates', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(edgeTemplate)
  });

  if (result3.success) {
    console.log('✅ 边界值模板创建成功:', result3.data);
  } else {
    console.error('❌ 边界值模板创建失败:', result3.error);
  }

  // 5. 测试无效数据
  console.log('\n步骤 5: 测试无效数据');
  const invalidTemplate = {
    name: '', // 空名称
    workDuration: 0, // 无效工作时间
    shortBreakDuration: -1, // 负数
    longBreakDuration: 200, // 超过最大值
    roundsBeforeLongBreak: 15 // 超过最大值
  };

  const result4 = await apiRequest('/pomodoro/templates', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(invalidTemplate)
  });

  if (result4.success) {
    console.log('⚠️  无效数据模板意外创建成功:', result4.data);
  } else {
    console.log('✅ 无效数据正确被拒绝:', result4.error);
  }
}

testTemplateCreation().catch(console.error);
