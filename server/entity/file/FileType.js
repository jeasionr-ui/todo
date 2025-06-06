
/**
 * 文件实体类型定义
 */
export const FileType = {
  id: '',              // 文件唯一标识
  originalName: '',    // 文件原始名称
  fileName: '',        // 存储的文件名称
  filePath: '',        // 文件存储路径
  mimeType: '',        // 文件MIME类型
  size: 0,             // 文件大小（字节）
  uploadedBy: '',      // 上传用户ID
  uploadedAt: '',      // 文件上传时间
  hash: '',            // 文件哈希值，用于去重
  status: 'active'     // 文件状态：active/deleted
};
