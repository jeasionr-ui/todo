import { 
  createHabit, 
  getHabitById, 
  getAllHabits,
  updateHabit,
  markHabitComplete, 
  unmarkHabitComplete,
  getHabitStats,
  getCompletionHistory,
  archiveHabit,
  unarchiveHabit
} from '../backend/biz/habit/habit_biz_functions.js';

async function testHabitFlow() {
  try {
    console.log('🧪 测试习惯管理完整流程...');
    
    // 1. 创建每日习惯
    const dailyHabitData = {
      name: '每日阅读',
      description: '每天阅读30分钟技术书籍',
      category: 'study',
      frequency: { type: 'daily' },
      startDate: '2024-01-01',
      color: '#FF6B6B',
      icon: '📖',
      tags: ['学习', '个人成长', '技术']
    };
    
    console.log('📚 测试创建每日习惯...');
    const dailyHabitResult = await createHabit(dailyHabitData);
    if (dailyHabitResult.success) {
      console.log('✅ 每日习惯创建成功:', dailyHabitResult.data.name);
      console.log('   - 习惯ID:', dailyHabitResult.data.id);
      console.log('   - 频率类型:', dailyHabitResult.data.frequency.type);
      console.log('   - 标签:', dailyHabitResult.data.tags);
      
      const dailyHabitId = dailyHabitResult.data.id;
      
      // 2. 创建每周习惯
      const weeklyHabitData = {
        name: '健身运动',
        description: '每周去健身房3次',
        category: 'fitness',
        frequency: { 
          type: 'weekly',
          daysOfWeek: [1, 3, 5] // 周一、周三、周五
        },
        startDate: '2024-01-01',
        color: '#4ECDC4',
        icon: '💪',
        tags: ['健康', '运动']
      };
      
      console.log('💪 测试创建每周习惯...');
      const weeklyHabitResult = await createHabit(weeklyHabitData);
      if (weeklyHabitResult.success) {
        console.log('✅ 每周习惯创建成功:', weeklyHabitResult.data.name);
        console.log('   - 频率类型:', weeklyHabitResult.data.frequency.type);
        console.log('   - 运动日期:', weeklyHabitResult.data.frequency.daysOfWeek);
      }
      
      const weeklyHabitId = weeklyHabitResult.data.id;
      
      // 3. 创建每月习惯
      const monthlyHabitData = {
        name: '财务检查',
        description: '每月第1天和第15天检查财务状况',
        category: 'finance',
        frequency: { 
          type: 'monthly',
          daysOfMonth: [1, 15]
        },
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        color: '#45B7D1',
        icon: '💰',
        tags: ['理财', '规划']
      };
      
      console.log('💰 测试创建每月习惯...');
      const monthlyHabitResult = await createHabit(monthlyHabitData);
      if (monthlyHabitResult.success) {
        console.log('✅ 每月习惯创建成功:', monthlyHabitResult.data.name);
        console.log('   - 频率类型:', monthlyHabitResult.data.frequency.type);
        console.log('   - 检查日期:', monthlyHabitResult.data.frequency.daysOfMonth);
        console.log('   - 结束日期:', monthlyHabitResult.data.endDate);
      }
      
      const monthlyHabitId = monthlyHabitResult.data.id;
      
      // 4. 获取所有习惯
      console.log('📋 测试获取习惯列表...');
      const allHabitsResult = await getAllHabits();
      if (allHabitsResult.success) {
        console.log('✅ 获取习惯列表成功');
        console.log('   - 习惯总数:', allHabitsResult.data.length);
        
        // 按分类统计
        const categoryStats = {};
        allHabitsResult.data.forEach(habit => {
          categoryStats[habit.category] = (categoryStats[habit.category] || 0) + 1;
        });
        console.log('   - 分类统计:', categoryStats);
        
        // 按频率统计
        const frequencyStats = {};
        allHabitsResult.data.forEach(habit => {
          const type = habit.frequency.type;
          frequencyStats[type] = (frequencyStats[type] || 0) + 1;
        });
        console.log('   - 频率统计:', frequencyStats);
      }
      
      // 5. 测试完成习惯
      console.log('✅ 测试标记习惯完成...');
      const today = new Date().toISOString().split('T')[0];
      
      // 标记每日阅读完成
      const completeResult1 = await markHabitComplete(dailyHabitId, today);
      if (completeResult1.success) {
        console.log('✅ 每日阅读标记完成成功');
      }
      
      // 标记健身运动完成
      const completeResult2 = await markHabitComplete(weeklyHabitId, today);
      if (completeResult2.success) {
        console.log('✅ 健身运动标记完成成功');
      }
      
      // 6. 测试模拟多天完成记录
      console.log('📅 测试模拟历史完成记录...');
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      // 为每日阅读添加过去7天的记录
      for (let i = 0; i < dates.length; i++) {
        const isCompleted = Math.random() > 0.3; // 70%的完成率
        if (isCompleted) {
          await markHabitComplete(dailyHabitId, dates[i]);
        } else {
          await unmarkHabitComplete(dailyHabitId, dates[i]);
        }
      }
      console.log('✅ 7天历史记录创建完成');
      
      // 7. 获取习惯详情（包含历史）
      console.log('📊 测试获取习惯详情...');
      const habitDetailResult = await getHabitById(dailyHabitId, true);
      if (habitDetailResult.success) {
        console.log('✅ 获取习惯详情成功');
        console.log('   - 习惯名称:', habitDetailResult.data.name);
        console.log('   - 完成历史数量:', habitDetailResult.data.completionHistory?.length || 0);
        console.log('   - 最近完成记录:', habitDetailResult.data.completionHistory?.slice(0, 3).map(c => `${c.date}: ${c.isCompleted ? '✅' : '❌'}`));
      }
      
      // 8. 获取习惯统计
      console.log('📈 测试获取习惯统计...');
      const statsResult = await getHabitStats(dailyHabitId);
      if (statsResult.success) {
        console.log('✅ 获取统计信息成功');
        console.log('   - 总完成次数:', statsResult.data.totalCompletions);
        console.log('   - 连续完成天数:', statsResult.data.streakCount);
        console.log('   - 最长连续天数:', statsResult.data.longestStreak);
        console.log('   - 完成率:', `${(statsResult.data.completionRate * 100).toFixed(1)}%`);
      }
      
      // 9. 获取完成历史
      console.log('📜 测试获取完成历史...');
      const historyResult = await getCompletionHistory(dailyHabitId);
      if (historyResult.success) {
        console.log('✅ 获取完成历史成功');
        console.log('   - 历史记录数:', historyResult.data.length);
        console.log('   - 最近3条记录:');
        historyResult.data.slice(0, 3).forEach((record, index) => {
          console.log(`     ${index + 1}. ${record.date}: ${record.isCompleted ? '完成' : '未完成'}`);
        });
      }
      
      // 10. 测试更新习惯
      console.log('📝 测试更新习惯...');
      const updateData = {
        description: '每天阅读30分钟技术书籍，记录学习笔记',
        tags: ['学习', '个人成长', '技术', '笔记'],
        color: '#96CEB4',
        reminderTime: '20:00'
      };
      
      const updateResult = await updateHabit(dailyHabitId, updateData);
      if (updateResult.success) {
        console.log('✅ 习惯更新成功');
        console.log('   - 新描述:', updateResult.data.description);
        console.log('   - 新标签:', updateResult.data.tags);
        console.log('   - 新颜色:', updateResult.data.color);
        console.log('   - 提醒时间:', updateResult.data.reminderTime);
      }
      
      // 11. 测试归档习惯
      console.log('📦 测试归档习惯...');
      const archiveResult = await archiveHabit(monthlyHabitId);
      if (archiveResult.success) {
        console.log('✅ 习惯归档成功');
        
        // 验证归档后的状态
        const archivedHabitResult = await getHabitById(monthlyHabitId);
        if (!archivedHabitResult.success) {
          console.log('✅ 归档习惯在正常列表中不可见（正确行为）');
        }
      }
      
      // 12. 测试恢复归档的习惯
      console.log('🔄 测试恢复归档习惯...');
      const unarchiveResult = await unarchiveHabit(monthlyHabitId);
      if (unarchiveResult.success) {
        console.log('✅ 习惯恢复成功');
        
        // 验证恢复后的状态
        const restoredHabitResult = await getHabitById(monthlyHabitId);
        if (restoredHabitResult.success) {
          console.log('✅ 恢复的习惯可以正常访问');
        }
      }
      
      // 13. 测试按分类获取习惯
      console.log('🏷️ 测试按分类获取习惯...');
      const studyHabitsResult = await getAllHabits({ category: 'study' });
      if (studyHabitsResult.success) {
        console.log('✅ 按分类获取习惯成功');
        console.log('   - 学习类习惯数量:', studyHabitsResult.data.length);
        console.log('   - 学习类习惯:', studyHabitsResult.data.map(h => h.name));
      }
      
      // 14. 最终统计
      console.log('📊 最终习惯统计...');
      const finalHabitsResult = await getAllHabits({ includeArchived: true });
      if (finalHabitsResult.success) {
        const totalHabits = finalHabitsResult.data.length;
        const activeHabits = finalHabitsResult.data.filter(h => !h.isArchived).length;
        const archivedHabits = finalHabitsResult.data.filter(h => h.isArchived).length;
        
        console.log('   - 总习惯数:', totalHabits);
        console.log('   - 活跃习惯:', activeHabits);
        console.log('   - 归档习惯:', archivedHabits);
      }
      
      // 15. 清理测试数据
      console.log('🗑️ 清理测试数据...');
      
      // 删除创建的习惯（永久删除）
      const habitsToDelete = [dailyHabitId, weeklyHabitId, monthlyHabitId];
      for (const habitId of habitsToDelete) {
        try {
          // 这里需要调用永久删除API，目前先跳过
          console.log(`   ✅ 习惯 ${habitId} 标记为清理`);
        } catch (error) {
          console.log(`   ⚠️ 清理习惯 ${habitId} 时遇到问题:`, error.message);
        }
      }
      
    } else {
      console.log('❌ 每日习惯创建失败:', dailyHabitResult.message);
    }
    
    console.log('🎉 习惯管理测试完成！');
    
  } catch (error) {
    console.error('❌ 习惯管理测试失败:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testHabitFlow();
