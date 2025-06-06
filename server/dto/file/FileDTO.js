
/**
 * 文件数据传输对象
 */
export const FileDTO = {
  id: '',              // 文件唯一标识
  originalName: '',    // 文件原始名称
  fileName: '',        // 存储的文件名称
  filePath: '',        // 文件存储路径
  mimeType: '',        // 文件MIME类型
  size: 0,             // 文件大小（字节）
  uploadedBy: '',      // 上传用户ID
  uploadedAt: '',      // 文件上传时间
  hash: '',            // 文件哈希值
  status: 'active',    // 文件状态
  downloadUrl: ''      // 下载链接（动态生成）
};
