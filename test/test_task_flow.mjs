import { getTodos, createTodo, updateTodo, deleteTodo } from '../backend/biz/task/task_biz.js';

async function testTaskFlow() {
  try {
    console.log('🧪 测试任务管理完整流程...');
    
    // 1. 创建新任务
    const taskData = {
      name: '完成项目文档',
      description: '编写项目的技术文档和用户手册',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-12-31',
      reminderTime: '09:00',
      tags: ['文档', '重要', '项目'],
      attachments: []
    };
    
    console.log('📝 测试创建任务...');
    const createdTask = await createTodo(taskData);
    if (createdTask) {
      console.log('✅ 任务创建成功:', createdTask.name);
      console.log('   - 任务ID:', createdTask.id);
      console.log('   - 优先级:', createdTask.priority);
      console.log('   - 截止日期:', createdTask.dueDate);
      console.log('   - 标签:', createdTask.tags);
      
      const taskId = createdTask.id;
      
      // 2. 创建第二个任务
      const taskData2 = {
        name: '代码重构',
        description: '重构核心业务逻辑代码',
        status: 'working',
        priority: 'medium',
        dueDate: '2024-11-30',
        reminderTime: '14:00',
        tags: ['开发', '重构'],
        attachments: []
      };
      
      const createdTask2 = await createTodo(taskData2);
      if (createdTask2) {
        console.log('✅ 第二个任务创建成功:', createdTask2.name);
      }
      
      // 3. 获取所有任务
      console.log('📋 测试获取任务列表...');
      const allTasks = await getTodos();
      if (allTasks && allTasks.length > 0) {
        console.log('✅ 获取任务列表成功');
        console.log('   - 任务总数:', allTasks.length);
        console.log('   - 最新任务:', allTasks[allTasks.length - 1].name);
        
        // 统计不同状态的任务
        const todoTasks = allTasks.filter(task => task.status === 'todo');
        const workingTasks = allTasks.filter(task => task.status === 'working');
        const doneTasks = allTasks.filter(task => task.status === 'done');
        
        console.log('   - 待办任务:', todoTasks.length);
        console.log('   - 进行中任务:', workingTasks.length);
        console.log('   - 已完成任务:', doneTasks.length);
      }
      
      // 4. 更新任务状态
      console.log('📝 测试更新任务...');
      const updateData = {
        status: 'working',
        description: '更新后的任务描述 - 正在进行中',
        priority: 'medium',
        tags: ['文档', '重要', '项目', '更新']
      };
      
      const updatedTask = await updateTodo(taskId, updateData);
      if (updatedTask) {
        console.log('✅ 任务更新成功');
        console.log('   - 新状态:', updatedTask.status);
        console.log('   - 新描述:', updatedTask.description);
        console.log('   - 新优先级:', updatedTask.priority);
        console.log('   - 新标签:', updatedTask.tags);
      }
      
      // 5. 再次更新任务为完成状态
      console.log('✅ 测试标记任务完成...');
      const completeUpdate = {
        status: 'done',
        description: '任务已完成！文档编写工作已结束。'
      };
      
      const completedTask = await updateTodo(taskId, completeUpdate);
      if (completedTask) {
        console.log('✅ 任务标记完成成功');
        console.log('   - 最终状态:', completedTask.status);
        console.log('   - 完成描述:', completedTask.description);
      }
      
      // 6. 测试任务附件处理
      console.log('📎 测试任务附件...');
      const attachmentUpdate = {
        attachments: ['file1.pdf', 'file2.docx', 'image1.png']
      };
      
      const taskWithAttachments = await updateTodo(taskId, attachmentUpdate);
      if (taskWithAttachments) {
        console.log('✅ 任务附件更新成功');
        console.log('   - 附件列表:', taskWithAttachments.attachments);
      }
      
      // 7. 测试不同优先级的任务
      console.log('🎯 测试创建不同优先级任务...');
      const priorityTasks = [
        { 
          name: '紧急修复', 
          description: '需要立即修复的关键问题',
          priority: 'high', 
          status: 'todo',
          tags: ['紧急', '修复'],
          attachments: []
        },
        { 
          name: '常规维护', 
          description: '日常系统维护工作',
          priority: 'medium', 
          status: 'todo',
          tags: ['维护'],
          attachments: []
        },
        { 
          name: '优化建议', 
          description: '系统性能优化建议',
          priority: 'low', 
          status: 'todo',
          tags: ['优化'],
          attachments: []
        }
      ];
      
      const createdPriorityTasks = [];
      for (const taskData of priorityTasks) {
        const task = await createTodo(taskData);
        if (task) {
          createdPriorityTasks.push(task);
          console.log(`   ✅ ${taskData.priority}优先级任务创建: ${task.name}`);
        }
      }
      
      // 8. 获取最新的任务列表并展示统计
      console.log('📊 最终任务统计...');
      const finalTasks = await getTodos();
      if (finalTasks) {
        const priorityStats = {
          high: finalTasks.filter(t => t.priority === 'high').length,
          medium: finalTasks.filter(t => t.priority === 'medium').length,
          low: finalTasks.filter(t => t.priority === 'low').length
        };
        
        const statusStats = {
          todo: finalTasks.filter(t => t.status === 'todo').length,
          working: finalTasks.filter(t => t.status === 'working').length,
          done: finalTasks.filter(t => t.status === 'done').length
        };
        
        console.log('   - 优先级统计:', priorityStats);
        console.log('   - 状态统计:', statusStats);
      }
      
      // 9. 清理测试数据
      console.log('🗑️ 清理测试数据...');
      
      // 删除主要测试任务
      await deleteTodo(taskId);
      console.log('   ✅ 主测试任务已删除');
      
      // 删除第二个任务
      if (createdTask2) {
        await deleteTodo(createdTask2.id);
        console.log('   ✅ 第二个测试任务已删除');
      }
      
      // 删除优先级测试任务
      for (const task of createdPriorityTasks) {
        await deleteTodo(task.id);
      }
      console.log('   ✅ 优先级测试任务已删除');
      
    } else {
      console.log('❌ 任务创建失败');
    }
    
    console.log('🎉 任务管理测试完成！');
    
  } catch (error) {
    console.error('❌ 任务管理测试失败:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testTaskFlow();
