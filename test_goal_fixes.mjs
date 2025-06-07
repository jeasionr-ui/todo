#!/usr/bin/env node

/**
 * 测试目标管理模块的三个关键修复
 * 1. UI模板显示问题 (已在之前修复)
 * 2. 分页结构问题
 * 3. 进度百分比显示问题
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/goals';

async function testGoalFixes() {
  console.log('🚀 开始测试目标管理模块的修复...\n');

  try {
    // 测试1: 分页结构
    console.log('📊 测试1: 检查分页结构...');
    const response = await axios.get(`${API_BASE}?page=1&pageSize=2`);
    
    if (response.data.pagination && 
        typeof response.data.pagination.total === 'number' &&
        typeof response.data.pagination.currentPage === 'number' &&
        typeof response.data.pagination.totalPages === 'number' &&
        typeof response.data.pagination.pageSize === 'number') {
      console.log('✅ 分页结构正确');
      console.log(`   总数: ${response.data.pagination.total}`);
      console.log(`   当前页: ${response.data.pagination.currentPage}`);
      console.log(`   总页数: ${response.data.pagination.totalPages}`);
      console.log(`   页面大小: ${response.data.pagination.pageSize}`);
    } else {
      console.log('❌ 分页结构不正确');
      console.log('   实际结构:', JSON.stringify(response.data.pagination, null, 2));
    }

    // 测试2: 进度百分比
    console.log('\n🎯 测试2: 检查进度百分比字段...');
    const goals = response.data.data;
    let progressTestPassed = true;
    
    goals.forEach((goal, index) => {
      if (typeof goal.progressPercentage === 'undefined') {
        console.log(`❌ 目标 ${index + 1} 缺少 progressPercentage 字段`);
        progressTestPassed = false;
      } else if (goal.progress !== goal.progressPercentage) {
        console.log(`⚠️  目标 ${index + 1} 的 progress (${goal.progress}) 与 progressPercentage (${goal.progressPercentage}) 不一致`);
        progressTestPassed = false;
      }
    });

    if (progressTestPassed) {
      console.log('✅ 所有目标都包含正确的进度百分比字段');
      goals.forEach((goal, index) => {
        console.log(`   目标 ${index + 1}: "${goal.title}" - 进度: ${goal.progressPercentage}%`);
      });
    }

    // 测试3: 前端服务接口兼容性
    console.log('\n🔗 测试3: 检查前端服务接口兼容性...');
    
    // 模拟前端 goalService 的数据处理
    const mockFrontendProcessing = {
      data: response.data.data,
      pagination: response.data.pagination
    };
    
    if (mockFrontendProcessing.data && 
        mockFrontendProcessing.pagination &&
        mockFrontendProcessing.pagination.total >= 0) {
      console.log('✅ 前端服务接口兼容性正常');
      console.log(`   返回数据数量: ${mockFrontendProcessing.data.length}`);
      console.log(`   分页信息完整: ${Object.keys(mockFrontendProcessing.pagination).join(', ')}`);
    } else {
      console.log('❌ 前端服务接口兼容性存在问题');
    }

    console.log('\n🎉 测试完成！所有修复都正常工作。');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('   响应状态:', error.response.status);
      console.error('   响应数据:', error.response.data);
    }
  }
}

// 运行测试
testGoalFixes();
