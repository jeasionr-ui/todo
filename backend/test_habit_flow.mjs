import { createHabit, getHabitById, markHabitComplete, getHabitStats } from './biz/habit/habit_biz_functions.js';

async function testHabitFlow() {
  try {
    console.log('🧪 测试习惯管理完整流程...');
    
    // 1. 创建习惯
    const habitData = {
      name: '每日阅读',
      description: '每天阅读30分钟',
      category: 'study',
      frequency: { type: 'daily' },
      startDate: '2024-01-01',
      color: '#FF6B6B',
      icon: '📖',
      tags: ['学习', '个人成长']
    };
    
    const createResult = await createHabit(habitData);
    if (createResult.success) {
      console.log('✅ 创建习惯成功:', createResult.data.name);
      
      const habitId = createResult.data.id;
      
      // 2. 标记为完成
      const completeResult = await markHabitComplete(habitId);
      if (completeResult.success) {
        console.log('✅ 标记完成成功');
        
        // 3. 获取习惯详情
        const habitResult = await getHabitById(habitId, true);
        if (habitResult.success) {
          console.log('✅ 获取习惯详情成功');
          console.log('   - 名称:', habitResult.data.name);
          console.log('   - 频率类型:', habitResult.data.frequency.type);
          console.log('   - 标签:', habitResult.data.tags);
          console.log('   - 完成历史数量:', habitResult.data.completionHistory?.length || 0);
          
          // 4. 获取统计信息
          const statsResult = await getHabitStats(habitId);
          if (statsResult.success) {
            console.log('✅ 获取统计信息成功');
            console.log('   - 总完成次数:', statsResult.data.totalCompletions);
            console.log('   - 连续完成天数:', statsResult.data.streakCount);
          }
        }
      }
    }
    
    console.log('🎉 所有测试通过！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error.stack);
  }
}

testHabitFlow();
