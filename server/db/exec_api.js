import mysql from 'mysql2/promise';
import { dbConfig } from './db_config.js';

export async function query(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return rows;
}

export async function execute(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.execute(sql, params);
  await connection.end();
  return result;
}