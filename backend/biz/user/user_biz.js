import { getAllUsersDb, getUserByIdDb, createUserDb, updateUserDb, deleteUserDb, getUserByEmailDb } from '../../db/user/user_db.js';
import { UserDTO } from '../../dto/user/UserDTO.js';
import bcrypt from 'bcrypt';

export async function getAllUsers() {
  const users = await getAllUsersDb();
  return users.map(u => new UserDTO(u));
}

export async function getUserById(id) {
  const user = await getUserByIdDb(id);
  return user ? new UserDTO(user) : null;
}

export async function createUser(user) {
  const created = await createUserDb(user);
  return new UserDTO(created);
}

export async function updateUser(id, user) {
  const updated = await updateUserDb(id, user);
  return new UserDTO(updated);
}

export async function deleteUser(id) {
  await deleteUserDb(id);
}

import { validatePassword } from '../../utils/passwordValidator.js';

export async function changeUserPassword(id, currentPassword, newPassword) {
  // 1. 获取用户
  const user = await getUserByIdDb(id);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. 验证当前密码
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    throw new Error('Current password is incorrect');
  }
  
  // 3. 验证新密码的复杂性
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    // 组合错误信息
    let errorMessage = 'Password is too weak';
    
    if (!passwordValidation.rules.hasMinLength) {
      errorMessage = 'Password is too short, must be at least 8 characters';
    } else if (!passwordValidation.rules.hasNumber) {
      errorMessage = 'Password must contain at least one number';
    } else if (!passwordValidation.rules.hasLowerCase || !passwordValidation.rules.hasUpperCase) {
      errorMessage = 'Password must contain both upper and lower case letters';
    } else if (!passwordValidation.rules.hasSpecialChar) {
      errorMessage = 'Password must contain at least one special character';
    } else if (!passwordValidation.rules.hasNoRepeatingChars) {
      errorMessage = 'Password cannot contain repeating characters';
    }
    
    throw new Error(errorMessage);
  }

  // 4. 加密新密码
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 5. 更新密码
  await updateUserDb(id, { password: hashedPassword });
  return true;
}
