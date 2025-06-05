import mysql from 'mysql2/promise'
import { dbConfig } from './db_config.js'

export async function query(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig)
  const [rows] = await connection.execute(sql, params)
  await connection.end()
  return rows
}

export async function execute(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig)
  const [result] = await connection.execute(sql, params)
  await connection.end()
  return result
}

export async function getOneById(table, id) {
  const sql = `SELECT * FROM ?? WHERE id = ?`
  const params = [table, id]
  const rows = await query(sql, params)
  return rows.length > 0 ? rows[0] : null
}

export async function insert(table, data) {
  const sql = `INSERT INTO ?? SET ?`
  const params = [table, data]
  const result = await execute(sql, params)
  return { id: result.insertId, ...data }
}

export async function update(table, id, data) {
  const sql = `UPDATE ?? SET ? WHERE id = ?`
  const params = [table, data, id]
  await execute(sql, params)
  return { id, ...data }
}
export async function remove(table, id) {
  const sql = `DELETE FROM ?? WHERE id = ?`
  const params = [table, id]
  await execute(sql, params)
  return { id }
}
export async function count(table) {
  const sql = `SELECT COUNT(*) AS count FROM ??`
  const params = [table]
  const rows = await query(sql, params)
  return rows[0].count
}
export async function exists(table, id) {
  const sql = `SELECT COUNT(*) AS count FROM ?? WHERE id = ?`
  const params = [table, id]
  const rows = await query(sql, params)
  return rows[0].count > 0
}

export async function getAllByCondition(table, condition) {
  const sql = `SELECT * FROM ?? WHERE ?`
  const params = [table, condition]
  return await query(sql, params)
}

export async function getPaginated(table, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize
  const sql = `SELECT * FROM ?? LIMIT ? OFFSET ?`
  const params = [table, pageSize, offset]
  return await query(sql, params)
}

export async function getPaginatedByCondition(table, condition, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize
  const sql = `SELECT * FROM ?? WHERE ? LIMIT ? OFFSET ?`
  const params = [table, condition, pageSize, offset]
  return await query(sql, params)
}
