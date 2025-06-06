#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 测试文件列表
const testFiles = [
  'test_user_flow.mjs',
  'test_task_flow.mjs', 
  'test_habit_flow.mjs'
];

// 测试名称映射
const testNames = {
  'test_user_flow.mjs': '👤 用户管理测试',
  'test_task_flow.mjs': '📋 任务管理测试',
  'test_habit_flow.mjs': '🔄 习惯管理测试'
};

// 运行单个测试
function runTest(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 开始运行: ${testNames[testFile]}`);
    console.log(`${'='.repeat(60)}\n`);
    
    const testPath = join(__dirname, testFile);
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${testNames[testFile]} 运行成功\n`);
        resolve();
      } else {
        console.log(`\n❌ ${testNames[testFile]} 运行失败 (退出码: ${code})\n`);
        reject(new Error(`Test failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.error(`\n❌ ${testNames[testFile]} 启动失败:`, error.message);
      reject(error);
    });
  });
}

// 主测试函数
async function runAllTests() {
  console.log('🧪 TODO 应用自动化测试套件');
  console.log(`📅 测试时间: ${new Date().toLocaleString()}`);
  console.log(`📁 测试目录: ${__dirname}`);
  
  const startTime = Date.now();
  let passedTests = 0;
  let failedTests = 0;
  const results = [];
  
  for (const testFile of testFiles) {
    try {
      const testStartTime = Date.now();
      await runTest(testFile);
      const testDuration = Date.now() - testStartTime;
      
      passedTests++;
      results.push({
        name: testNames[testFile],
        status: 'PASSED',
        duration: testDuration
      });
    } catch (error) {
      const testDuration = Date.now() - testStartTime;
      
      failedTests++;
      results.push({
        name: testNames[testFile],
        status: 'FAILED',
        duration: testDuration,
        error: error.message
      });
    }
  }
  
  const totalDuration = Date.now() - startTime;
  
  // 输出测试结果摘要
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 测试结果摘要');
  console.log(`${'='.repeat(80)}`);
  
  results.forEach((result, index) => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    const duration = `${(result.duration / 1000).toFixed(2)}s`;
    console.log(`${index + 1}. ${status} ${result.name} (${duration})`);
    if (result.error) {
      console.log(`   错误: ${result.error}`);
    }
  });
  
  console.log(`\n📈 总体统计:`);
  console.log(`   - 运行测试: ${testFiles.length} 个`);
  console.log(`   - 通过测试: ${passedTests} 个`);
  console.log(`   - 失败测试: ${failedTests} 个`);
  console.log(`   - 成功率: ${((passedTests / testFiles.length) * 100).toFixed(1)}%`);
  console.log(`   - 总耗时: ${(totalDuration / 1000).toFixed(2)}s`);
  
  if (failedTests === 0) {
    console.log(`\n🎉 所有测试都通过了！系统运行正常。`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  有 ${failedTests} 个测试失败，请检查相关功能。`);
    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);
if (args.length > 0) {
  const requestedTest = args[0];
  const testFile = `test_${requestedTest}_flow.mjs`;
  
  if (testFiles.includes(testFile)) {
    console.log(`🎯 运行单个测试: ${testNames[testFile]}`);
    runTest(testFile).catch(() => process.exit(1));
  } else {
    console.log(`❌ 未找到测试: ${requestedTest}`);
    console.log(`📋 可用的测试:`);
    console.log(`   - user   (用户管理测试)`);
    console.log(`   - task   (任务管理测试)`);
    console.log(`   - habit  (习惯管理测试)`);
    console.log(`\n💡 使用方法:`);
    console.log(`   node run_tests.mjs           # 运行所有测试`);
    console.log(`   node run_tests.mjs user      # 只运行用户测试`);
    console.log(`   node run_tests.mjs task      # 只运行任务测试`);
    console.log(`   node run_tests.mjs habit     # 只运行习惯测试`);
    process.exit(1);
  }
} else {
  // 运行所有测试
  runAllTests().catch(() => process.exit(1));
}
