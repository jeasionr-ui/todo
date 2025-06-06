import { 
  createFileDb, 
  getFileByIdDb, 
  getFilesByIdsDb,
  getAllFilesDb, 
  getFilesByUserDb, 
  deleteFileDb, 
  getFileByHashDb 
} from '../../db/file/file_db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 上传文件夹路径
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * 计算文件哈希值
 * @param {string} filePath 文件路径
 * @returns {Promise<string>} 文件哈希值
 */
export async function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * 保存上传的文件
 * @param {Object} file 上传的文件对象
 * @param {string} uploadedBy 上传用户ID
 * @returns {Promise<Object>} 保存的文件信息
 */
export async function saveUploadedFile(file, uploadedBy = null) {
  try {
    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    // 保存文件到磁盘
    fs.writeFileSync(filePath, file.buffer);
    
    // 计算文件哈希值
    const hash = await calculateFileHash(filePath);
    
    // 检查是否已存在相同文件
    const existingFile = await getFileByHashDb(hash);
    if (existingFile) {
      // 删除刚保存的重复文件
      fs.unlinkSync(filePath);
      return existingFile;
    }
    
    // 保存文件信息到数据库
    const fileInfo = {
      originalName: file.originalname,
      fileName: fileName,
      filePath: filePath,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: uploadedBy,
      hash: hash
    };
    
    const savedFile = await createFileDb(fileInfo);
    return savedFile;
    
  } catch (error) {
    console.error('保存文件失败:', error);
    throw new Error('文件保存失败');
  }
}

/**
 * 获取文件信息
 * @param {string} fileId 文件ID
 * @returns {Promise<Object|null>} 文件信息
 */
export async function getFileInfo(fileId) {
  return await getFileByIdDb(fileId);
}

/**
 * 批量获取文件信息
 * @param {Array<string>} fileIds 文件ID数组
 * @returns {Promise<Array>} 文件信息数组
 */
export async function getFilesInfo(fileIds) {
  return await getFilesByIdsDb(fileIds);
}

/**
 * 获取所有文件
 * @returns {Promise<Array>} 所有文件列表
 */
export async function getAllFiles() {
  return await getAllFilesDb();
}

/**
 * 获取用户上传的文件
 * @param {string} userId 用户ID
 * @returns {Promise<Array>} 用户文件列表
 */
export async function getUserFiles(userId) {
  return await getFilesByUserDb(userId);
}

/**
 * 删除文件
 * @param {string} fileId 文件ID
 * @returns {Promise<boolean>} 删除结果
 */
export async function deleteFile(fileId) {
  const file = await getFileByIdDb(fileId);
  if (!file) {
    throw new Error('文件不存在');
  }
  
  try {
    // 从磁盘删除文件
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    
    // 从数据库删除记录
    await deleteFileDb(fileId);
    return true;
    
  } catch (error) {
    console.error('删除文件失败:', error);
    throw new Error('文件删除失败');
  }
}

/**
 * 获取文件下载流
 * @param {string} fileId 文件ID
 * @returns {Promise<Object>} 文件流信息
 */
export async function getFileStream(fileId) {
  const file = await getFileByIdDb(fileId);
  if (!file) {
    throw new Error('文件不存在');
  }
  
  if (!fs.existsSync(file.filePath)) {
    throw new Error('文件在磁盘上不存在');
  }
  
  return {
    stream: fs.createReadStream(file.filePath),
    filename: file.originalName,
    mimetype: file.mimeType,
    size: file.size
  };
}
