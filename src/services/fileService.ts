import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/file';

export interface FileInfo {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: FileInfo;
}

export interface BatchUploadResponse {
  success: boolean;
  message: string;
  data?: FileInfo[];
}

/**
 * 上传单个文件
 * @param file 要上传的文件
 * @param userId 可选的用户ID
 * @returns Promise<FileInfo>
 */
export async function uploadFile(file: File, userId?: string): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  if (userId) {
    headers['user-id'] = userId;
  }

  try {
    const response = await axios.post<UploadResponse>(`${API_BASE_URL}/upload`, formData, {
      headers,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '文件上传失败');
    }
  } catch (error: any) {
    console.error('文件上传失败:', error);
    throw new Error(error.response?.data?.message || '文件上传失败');
  }
}

/**
 * 批量上传文件
 * @param files 要上传的文件数组
 * @param userId 可选的用户ID
 * @returns Promise<FileInfo[]>
 */
export async function uploadMultipleFiles(files: File[], userId?: string): Promise<FileInfo[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  if (userId) {
    headers['user-id'] = userId;
  }

  try {
    const response = await axios.post<BatchUploadResponse>(`${API_BASE_URL}/upload-multiple`, formData, {
      headers,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '批量文件上传失败');
    }
  } catch (error: any) {
    console.error('批量文件上传失败:', error);
    throw new Error(error.response?.data?.message || '批量文件上传失败');
  }
}

/**
 * 获取文件信息
 * @param fileId 文件ID
 * @returns Promise<FileInfo>
 */
export async function getFileInfo(fileId: string): Promise<FileInfo> {
  try {
    const response = await axios.get<{ success: boolean; data: FileInfo }>(`${API_BASE_URL}/info/${fileId}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('获取文件信息失败');
    }
  } catch (error: any) {
    console.error('获取文件信息失败:', error);
    throw new Error(error.response?.data?.message || '获取文件信息失败');
  }
}

/**
 * 批量获取文件信息
 * @param fileIds 文件ID数组
 * @returns Promise<FileInfo[]>
 */
export async function getFilesInfo(fileIds: string[]): Promise<FileInfo[]> {
  try {
    const response = await axios.post<{ success: boolean; data: FileInfo[] }>(`${API_BASE_URL}/info-batch`, {
      fileIds,
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('批量获取文件信息失败');
    }
  } catch (error: any) {
    console.error('批量获取文件信息失败:', error);
    throw new Error(error.response?.data?.message || '批量获取文件信息失败');
  }
}

/**
 * 删除文件
 * @param fileId 文件ID
 * @returns Promise<boolean>
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    const response = await axios.delete<{ success: boolean; message: string }>(`${API_BASE_URL}/${fileId}`);
    return response.data.success;
  } catch (error: any) {
    console.error('删除文件失败:', error);
    throw new Error(error.response?.data?.message || '删除文件失败');
  }
}

/**
 * 获取文件下载链接
 * @param fileId 文件ID
 * @returns string 下载链接
 */
export function getDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/download/${fileId}`;
}

/**
 * 下载文件
 * @param fileId 文件ID
 * @param filename 可选的文件名
 */
export function downloadFile(fileId: string, filename?: string): void {
  const url = getDownloadUrl(fileId);
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
