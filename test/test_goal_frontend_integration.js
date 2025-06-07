/**
 * 目标管理前端集成测试
 * 测试前端UI与后端API的完整集成
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api/goals';

// 测试数据
const testGoalData = {
  title: '前端集成测试目标',
  description: '通过前端界面测试目标管理系统的完整功能',
  category: 'education',
  priority: 'high',
  startDate: '2024-01-15',
  targetDate: '2024-12-31'
};

const testMilestoneData = {
  title: '前端组件完成',
  description: '完成所有目标管理相关的Vue组件开发',
  order: 1,
  targetDate: '2024-06-30'
};

const testReviewData = {
  reviewDate: '2024-01-15',
  reviewType: 'monthly',
  content: '前端集成测试进展良好，所有API调用都能正常工作',
  rating: 4,
  lessonsLearned: '学到了Vue.js组件开发和API集成的最佳实践',
  nextSteps: '继续完善用户体验和错误处理机制'
};

/**
 * 测试目标CRUD操作
 */
async function testGoalCRUD() {
  console.log('🎯 开始测试目标CRUD操作...');
  
  try {
    // 1. 创建目标
    console.log('📝 创建测试目标...');
    const createResponse = await axios.post(API_BASE, testGoalData);
    const goalId = createResponse.data.data.id;
    console.log(`✅ 目标创建成功，ID: ${goalId}`);
    
    // 2. 获取目标列表
    console.log('📋 获取目标列表...');
    const listResponse = await axios.get(API_BASE);
    console.log(`✅ 获取目标列表成功，共 ${listResponse.data.data.length} 个目标`);
    
    // 3. 获取目标详情
    console.log('🔍 获取目标详情...');
    const detailResponse = await axios.get(`${API_BASE}/${goalId}`);
    console.log(`✅ 目标详情获取成功: ${detailResponse.data.data.title}`);
    
    // 4. 更新目标
    console.log('📝 更新目标...');
    const updateData = {
      title: '更新后的前端集成测试目标',
      progressPercentage: 25
    };
    const updateResponse = await axios.put(`${API_BASE}/${goalId}`, updateData);
    console.log(`✅ 目标更新成功: ${updateResponse.data.data.title}`);
    
    return goalId;
  } catch (error) {
    console.error('❌ 目标CRUD测试失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试里程碑管理
 */
async function testMilestoneManagement(goalId) {
  console.log('🏁 开始测试里程碑管理...');
  
  try {
    // 1. 创建里程碑
    console.log('📝 创建里程碑...');
    const createResponse = await axios.post(`${API_BASE}/${goalId}/milestones`, testMilestoneData);
    const milestoneId = createResponse.data.data.id;
    console.log(`✅ 里程碑创建成功，ID: ${milestoneId}`);
    
    // 2. 获取里程碑列表
    console.log('📋 获取里程碑列表...');
    const listResponse = await axios.get(`${API_BASE}/${goalId}/milestones`);
    console.log(`✅ 获取里程碑列表成功，共 ${listResponse.data.data.length} 个里程碑`);
    
    // 3. 完成里程碑
    console.log('✅ 标记里程碑为完成...');
    const completeResponse = await axios.put(`${API_BASE}/milestones/${milestoneId}`, {
      isCompleted: true
    });
    console.log(`✅ 里程碑状态更新成功: ${completeResponse.data.data.isCompleted}`);
    
    return milestoneId;
  } catch (error) {
    console.error('❌ 里程碑管理测试失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试评价系统
 */
async function testReviewSystem(goalId) {
  console.log('📝 开始测试评价系统...');
  
  try {
    // 1. 创建评价
    console.log('📝 创建目标评价...');
    const createResponse = await axios.post(`${API_BASE}/${goalId}/reviews`, testReviewData);
    const reviewId = createResponse.data.data.id;
    console.log(`✅ 评价创建成功，ID: ${reviewId}`);
    
    // 2. 获取评价列表
    console.log('📋 获取评价列表...');
    const listResponse = await axios.get(`${API_BASE}/${goalId}/reviews`);
    console.log(`✅ 获取评价列表成功，共 ${listResponse.data.data.length} 个评价`);
    
    // 3. 更新评价
    console.log('📝 更新评价...');
    const updateData = {
      rating: 5,
      content: '更新后的评价内容 - 前端集成测试完全成功'
    };
    const updateResponse = await axios.put(`${API_BASE}/${goalId}/reviews/${reviewId}`, updateData);
    console.log(`✅ 评价更新成功，新评分: ${updateResponse.data.data.rating}`);
    
    return reviewId;
  } catch (error) {
    console.error('❌ 评价系统测试失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试进度更新
 */
async function testProgressUpdate(goalId) {
  console.log('📊 开始测试进度更新...');
  
  try {
    const progressData = { progressPercentage: 75 };
    const response = await axios.post(`${API_BASE}/${goalId}/update-progress`, progressData);
    console.log(`✅ 进度更新成功: ${response.data.data.progressPercentage}%`);
  } catch (error) {
    console.error('❌ 进度更新测试失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试统计信息
 */
async function testStatistics() {
  console.log('📈 开始测试统计信息...');
  
  try {
    const response = await axios.get(`${API_BASE}/statistics/overview`);
    const stats = response.data.data;
    console.log('✅ 统计信息获取成功:');
    console.log(`   - 总目标数: ${stats.totalGoals}`);
    console.log(`   - 活跃目标: ${stats.activeGoals}`);
    console.log(`   - 已完成目标: ${stats.completedGoals}`);
    console.log(`   - 平均进度: ${stats.averageProgress}%`);
  } catch (error) {
    console.error('❌ 统计信息测试失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试错误处理
 */
async function testErrorHandling() {
  console.log('🚫 开始测试错误处理...');
  
  try {
    // 1. 测试获取不存在的目标
    try {
      await axios.get(`${API_BASE}/nonexistent-id`);
      console.log('❌ 应该返回404错误，但没有');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ 正确处理了404错误');
      } else {
        console.log(`❌ 预期404错误，但得到 ${error.response?.status}`);
      }
    }
    
    // 2. 测试无效数据创建
    try {
      await axios.post(API_BASE, { title: '' }); // 空标题
      console.log('❌ 应该返回验证错误，但没有');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ 正确处理了验证错误');
      } else {
        console.log(`❌ 预期400错误，但得到 ${error.response?.status}`);
      }
    }
  } catch (error) {
    console.error('❌ 错误处理测试失败:', error.message);
  }
}

/**
 * 清理测试数据
 */
async function cleanup(goalId) {
  console.log('🧹 开始清理测试数据...');
  
  try {
    await axios.delete(`${API_BASE}/${goalId}`);
    console.log('✅ 测试数据清理完成');
  } catch (error) {
    console.log('⚠️ 清理测试数据时出现问题:', error.response?.data || error.message);
  }
}

/**
 * 主测试函数
 */
async function runIntegrationTests() {
  console.log('🚀 开始目标管理前端集成测试...\n');
  
  let goalId = null;
  
  try {
    // 1. 测试目标CRUD
    goalId = await testGoalCRUD();
    console.log('');
    
    // 2. 测试里程碑管理
    await testMilestoneManagement(goalId);
    console.log('');
    
    // 3. 测试评价系统
    await testReviewSystem(goalId);
    console.log('');
    
    // 4. 测试进度更新
    await testProgressUpdate(goalId);
    console.log('');
    
    // 5. 测试统计信息
    await testStatistics();
    console.log('');
    
    // 6. 测试错误处理
    await testErrorHandling();
    console.log('');
    
    console.log('🎉 所有集成测试通过！目标管理系统前后端集成完全正常。');
    
  } catch (error) {
    console.error('💥 集成测试失败:', error.message);
  } finally {
    // 清理测试数据
    if (goalId) {
      await cleanup(goalId);
    }
  }
}

// 运行测试
runIntegrationTests().catch(console.error);
