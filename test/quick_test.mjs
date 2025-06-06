#!/usr/bin/env node

/**
 * 快速测试脚本 - 简化版自动化测试
 * 用于快速验证核心功能是否正常
 */

import { createUser, getUserById, deleteUser } from '../backend/biz/user/user_biz.js';
import { createTodo, getTodos, deleteTodo } from '../backend/biz/task/task_biz.js';
import { createHabit, getHabitById, markHabitComplete } from '../backend/biz/habit/habit_biz_functions.js';

async function quickTest() {
  console.log('⚡ 快速功能测试开始...\n');
  
  let allPassed = true;
  
  // 用户测试
  try {
    console.log('👤 测试用户功能...');
    const user = await createUser({
      firstName: 'Quick',
      lastName: 'Test',
      email: `quicktest_${Date.now()}@test.com`,
      password: 'test123'
    });
    
    if (user && user.id) {
      console.log('✅ 用户创建成功');
      const fetchedUser = await getUserById(user.id);
      if (fetchedUser) {
        console.log('✅ 用户查询成功');
        await deleteUser(user.id);
        console.log('✅ 用户删除成功');
      } else {
        throw new Error('用户查询失败');
      }
    } else {
      throw new Error('用户创建失败');
    }
  } catch (error) {
    console.log('❌ 用户测试失败:', error.message);
    allPassed = false;
  }
  
  // 任务测试
  try {
    console.log('\n📋 测试任务功能...');
    const task = await createTodo({
      name: '快速测试任务',
      description: '这是一个快速测试任务',
      status: 'todo',
      priority: 'medium',
      tags: ['测试'],
      attachments: []
    });
    
    if (task && task.id) {
      console.log('✅ 任务创建成功');
      const tasks = await getTodos();
      if (tasks && tasks.length > 0) {
        console.log('✅ 任务列表获取成功');
        await deleteTodo(task.id);
        console.log('✅ 任务删除成功');
      } else {
        throw new Error('任务列表获取失败');
      }
    } else {
      throw new Error('任务创建失败');
    }
  } catch (error) {
    console.log('❌ 任务测试失败:', error.message);
    allPassed = false;
  }
  
  // 习惯测试
  try {
    console.log('\n🔄 测试习惯功能...');
    const habitResult = await createHabit({
      name: '快速测试习惯',
      description: '这是一个快速测试习惯',
      category: 'test',
      frequency: { type: 'daily' },
      startDate: '2024-01-01',
      color: '#FF6B6B',
      icon: '🧪',
      tags: ['测试']
    });
    
    if (habitResult.success && habitResult.data) {
      const habitId = habitResult.data.id;
      console.log('✅ 习惯创建成功');
      
      const completeResult = await markHabitComplete(habitId);
      if (completeResult.success) {
        console.log('✅ 习惯完成标记成功');
        
        const habitDetail = await getHabitById(habitId, true);
        if (habitDetail.success) {
          console.log('✅ 习惯详情获取成功');
          // 注意：这里不删除习惯，因为测试习惯可以保留用于演示
        } else {
          throw new Error('习惯详情获取失败');
        }
      } else {
        throw new Error('习惯完成标记失败');
      }
    } else {
      throw new Error('习惯创建失败');
    }
  } catch (error) {
    console.log('❌ 习惯测试失败:', error.message);
    allPassed = false;
  }
  
  // 总结
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 所有核心功能测试通过！系统运行正常。');
  } else {
    console.log('⚠️ 部分测试失败，请检查系统状态。');
  }
  console.log('='.repeat(50));
}

// 运行快速测试
quickTest().catch(error => {
  console.error('💥 快速测试运行出错:', error);
  process.exit(1);
});
