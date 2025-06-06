import { getAllUsersDb, getUserByIdDb, createUserDb, updateUserDb, deleteUserDb } from '../../db/user/user_db.js';
import { UserDTO } from '../../dto/user/UserDTO.js';

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
