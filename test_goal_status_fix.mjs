#!/usr/bin/env node

/**
 * 测试目标状态修复 - 验证'draft'状态是否正常工作
 */

const API_BASE = 'http://localhost:3001/api';

async function testGoalStatusFix() {
  console.log('🧪 测试目标状态修复...\n');

  try {
    // 1. 测试创建目标 (默认状态应该是 'draft')
    console.log('1️⃣ 测试创建目标 (默认状态: draft)');
    const createResponse = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '测试目标 - 状态修复验证',
        description: '这是一个用于验证状态修复的测试目标',
        category: 'personal',
        priority: 'medium',
        startDate: '2025-01-01',
        targetDate: '2025-12-31',
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error('❌ 创建目标失败:', createResponse.status, errorData);
      return;
    }

    const createdGoalResponse = await createResponse.json();
    if (!createdGoalResponse.success) {
      console.error('❌ 创建目标失败:', createdGoalResponse.message);
      return;
    }

    const createdGoal = createdGoalResponse.data;
    console.log('✅ 目标创建成功');
    console.log('📊 目标信息:', {
      id: createdGoal.id,
      title: createdGoal.title,
      status: createdGoal.status,
      progressPercentage: createdGoal.progressPercentage
    });

    if (createdGoal.status !== 'draft') {
      console.error('❌ 错误: 新创建的目标状态应该是 "draft"，但实际是:', createdGoal.status);
      return;
    }

    // 2. 测试更新目标状态
    console.log('\n2️⃣ 测试更新目标状态');
    const updateResponse = await fetch(`${API_BASE}/goals/${createdGoal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: createdGoal.title,
        description: createdGoal.description,
        category: createdGoal.category,
        priority: createdGoal.priority,
        status: 'active',
        progressPercentage: 25,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error('❌ 更新目标失败:', updateResponse.status, errorData);
      return;
    }

    const updatedGoalResponse = await updateResponse.json();
    if (!updatedGoalResponse.success) {
      console.error('❌ 更新目标失败:', updatedGoalResponse.message);
      return;
    }

    const updatedGoal = updatedGoalResponse.data;
    console.log('✅ 目标更新成功');
    console.log('📊 更新后的目标信息:', {
      id: updatedGoal.id,
      title: updatedGoal.title,
      status: updatedGoal.status,
      progressPercentage: updatedGoal.progressPercentage
    });

    // 3. 测试所有有效状态
    console.log('\n3️⃣ 测试所有有效状态');
    const validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
    
    for (const status of validStatuses) {
      console.log(`   测试状态: ${status}`);
      const statusUpdateResponse = await fetch(`${API_BASE}/goals/${createdGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!statusUpdateResponse.ok) {
        const errorData = await statusUpdateResponse.text();
        console.error(`   ❌ 状态 "${status}" 更新失败:`, statusUpdateResponse.status, errorData);
        continue;
      }

      const statusUpdatedGoalResponse = await statusUpdateResponse.json();
      if (!statusUpdatedGoalResponse.success) {
        console.error(`   ❌ 状态 "${status}" 更新失败:`, statusUpdatedGoalResponse.message);
        continue;
      }

      const statusUpdatedGoal = statusUpdatedGoalResponse.data;
      if (statusUpdatedGoal.status === status) {
        console.log(`   ✅ 状态 "${status}" 更新成功`);
      } else {
        console.error(`   ❌ 状态更新失败: 期望 "${status}"，实际 "${statusUpdatedGoal.status}"`);
      }
    }

    // 4. 测试无效状态 (应该失败)
    console.log('\n4️⃣ 测试无效状态 (应该失败)');
    const invalidStatusResponse = await fetch(`${API_BASE}/goals/${createdGoal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'planning', // 这个状态现在应该无效
      }),
    });

    if (invalidStatusResponse.ok) {
      console.error('❌ 错误: 无效状态 "planning" 不应该被接受');
    } else {
      console.log('✅ 无效状态 "planning" 正确被拒绝');
    }

    // 5. 清理 - 删除测试目标
    console.log('\n5️⃣ 清理测试数据');
    const deleteResponse = await fetch(`${API_BASE}/goals/${createdGoal.id}`, {
      method: 'DELETE',
    });

    if (deleteResponse.ok) {
      console.log('✅ 测试目标删除成功');
    } else {
      console.log('⚠️ 测试目标删除失败，需要手动清理');
    }

    console.log('\n🎉 所有测试完成！状态修复验证成功！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.error('详细错误:', error);
  }
}

// 运行测试
testGoalStatusFix();
