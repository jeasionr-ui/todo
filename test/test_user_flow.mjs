import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../backend/biz/user/user_biz.js';
import { loginBiz, registerBiz } from '../backend/biz/auth/auth_biz.js';

async function testUserFlow() {
  try {
    console.log('🧪 测试用户管理完整流程...');
    
    // 1. 注册新用户
    const userData = {
      firstName: '测试',
      lastName: '用户',
      email: `test_${Date.now()}@example.com`,
      password: 'test123456',
      phone: '13800138000',
      country: '中国',
      city: '北京',
      bio: '这是一个测试用户'
    };
    
    console.log('📝 测试用户注册...');
    const registerResult = await registerBiz(userData);
    if (registerResult && registerResult.user) {
      console.log('✅ 用户注册成功:', registerResult.user.email);
      console.log('   - 用户ID:', registerResult.user.id);
      console.log('   - Token生成:', registerResult.token ? '成功' : '失败');
      
      const userId = registerResult.user.id;
      
      // 2. 登录测试
      console.log('🔐 测试用户登录...');
      const loginResult = await loginBiz(userData.email, userData.password);
      if (loginResult && loginResult.user) {
        console.log('✅ 用户登录成功');
        console.log('   - 登录用户:', loginResult.user.email);
        console.log('   - Token验证:', loginResult.token ? '通过' : '失败');
      } else {
        console.log('❌ 用户登录失败');
      }
      
      // 3. 获取用户详情
      console.log('👤 测试获取用户详情...');
      const userDetail = await getUserById(userId);
      if (userDetail) {
        console.log('✅ 获取用户详情成功');
        console.log('   - 姓名:', `${userDetail.firstName} ${userDetail.lastName}`);
        console.log('   - 邮箱:', userDetail.email);
        console.log('   - 城市:', userDetail.city);
        console.log('   - 个人简介:', userDetail.bio);
      } else {
        console.log('❌ 获取用户详情失败');
      }
      
      // 4. 更新用户信息
      console.log('📝 测试更新用户信息...');
      const updateData = {
        bio: '这是更新后的个人简介',
        city: '上海',
        phone: '13900139000',
        socialAccounts: {
          facebook: 'test_facebook',
          twitter: 'test_twitter'
        }
      };
      
      const updatedUser = await updateUser(userId, updateData);
      if (updatedUser) {
        console.log('✅ 用户信息更新成功');
        console.log('   - 新个人简介:', updatedUser.bio);
        console.log('   - 新城市:', updatedUser.city);
        console.log('   - 新手机:', updatedUser.phone);
        console.log('   - 社交账号:', JSON.stringify(updatedUser.socialAccounts));
      } else {
        console.log('❌ 用户信息更新失败');
      }
      
      // 5. 获取所有用户（测试列表功能）
      console.log('📋 测试获取用户列表...');
      const allUsers = await getAllUsers();
      if (allUsers && allUsers.length > 0) {
        console.log('✅ 获取用户列表成功');
        console.log('   - 用户总数:', allUsers.length);
        console.log('   - 最新用户:', allUsers[allUsers.length - 1].email);
      } else {
        console.log('❌ 获取用户列表失败');
      }
      
      // 6. 测试错误的登录
      console.log('🚫 测试错误密码登录...');
      const wrongLoginResult = await loginBiz(userData.email, 'wrongpassword');
      if (!wrongLoginResult) {
        console.log('✅ 错误密码登录正确拒绝');
      } else {
        console.log('❌ 错误密码登录未被拒绝 - 安全问题！');
      }
      
      // 7. 删除测试用户
      console.log('🗑️ 清理测试数据...');
      await deleteUser(userId);
      console.log('✅ 测试用户已删除');
      
    } else {
      console.log('❌ 用户注册失败');
    }
    
    console.log('🎉 用户管理测试完成！');
    
  } catch (error) {
    console.error('❌ 用户管理测试失败:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testUserFlow();
