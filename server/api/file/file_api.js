import express from 'express';
import multer from 'multer';
import { 
  saveUploadedFile, 
  getFileInfo, 
  getFilesInfo,
  getAllFiles, 
  getUserFiles, 
  deleteFile, 
  getFileStream 
} from '../../biz/file/file_biz.js';

const router = express.Router();

// 配置multer用于处理文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 限制文件大小为10MB
  },
  fileFilter: (req, file, cb) => {
    // 可以在这里添加文件类型过滤
    cb(null, true);
  }
});

/**
 * 上传文件
 * POST /api/file/upload
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有文件被上传'
      });
    }

    const uploadedBy = req.headers['user-id'] || null; // 从请求头获取用户ID
    const savedFile = await saveUploadedFile(req.file, uploadedBy);

    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        id: savedFile.id,
        originalName: savedFile.originalName,
        size: savedFile.size,
        mimeType: savedFile.mimeType,
        uploadedAt: savedFile.uploadedAt,
        downloadUrl: `/api/file/download/${savedFile.id}`
      }
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '文件上传失败'
    });
  }
});

/**
 * 批量上传文件
 * POST /api/file/upload-multiple
 */
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有文件被上传'
      });
    }

    const uploadedBy = req.headers['user-id'] || null;
    const savedFiles = [];

    for (const file of req.files) {
      try {
        const savedFile = await saveUploadedFile(file, uploadedBy);
        savedFiles.push({
          id: savedFile.id,
          originalName: savedFile.originalName,
          size: savedFile.size,
          mimeType: savedFile.mimeType,
          uploadedAt: savedFile.uploadedAt,
          downloadUrl: `/api/file/download/${savedFile.id}`
        });
      } catch (error) {
        console.error(`文件 ${file.originalname} 上传失败:`, error);
        // 继续处理其他文件
      }
    }

    res.json({
      success: true,
      message: `成功上传 ${savedFiles.length} 个文件`,
      data: savedFiles
    });

  } catch (error) {
    console.error('批量文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '批量文件上传失败'
    });
  }
});

/**
 * 下载文件
 * GET /api/file/download/:id
 */
router.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileStream = await getFileStream(fileId);

    res.set({
      'Content-Type': fileStream.mimetype,
      'Content-Length': fileStream.size,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileStream.filename)}"`
    });

    fileStream.stream.pipe(res);

  } catch (error) {
    console.error('文件下载失败:', error);
    res.status(404).json({
      success: false,
      message: error.message || '文件下载失败'
    });
  }
});

/**
 * 获取文件信息
 * GET /api/file/info/:id
 */
router.get('/info/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await getFileInfo(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    res.json({
      success: true,
      data: {
        ...file,
        downloadUrl: `/api/file/download/${file.id}`
      }
    });

  } catch (error) {
    console.error('获取文件信息失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取文件信息失败'
    });
  }
});

/**
 * 批量获取文件信息
 * POST /api/file/info-batch
 */
router.post('/info-batch', async (req, res) => {
  try {
    const { fileIds } = req.body;

    if (!fileIds || !Array.isArray(fileIds)) {
      return res.status(400).json({
        success: false,
        message: '文件ID列表格式不正确'
      });
    }

    const files = await getFilesInfo(fileIds);
    const filesWithDownloadUrl = files.map(file => ({
      ...file,
      downloadUrl: `/api/file/download/${file.id}`
    }));

    res.json({
      success: true,
      data: filesWithDownloadUrl
    });

  } catch (error) {
    console.error('批量获取文件信息失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '批量获取文件信息失败'
    });
  }
});

/**
 * 获取所有文件列表
 * GET /api/file/list
 */
router.get('/list', async (req, res) => {
  try {
    const files = await getAllFiles();
    const filesWithDownloadUrl = files.map(file => ({
      ...file,
      downloadUrl: `/api/file/download/${file.id}`
    }));

    res.json({
      success: true,
      data: filesWithDownloadUrl
    });

  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取文件列表失败'
    });
  }
});

/**
 * 获取用户文件列表
 * GET /api/file/user/:userId
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const files = await getUserFiles(userId);
    const filesWithDownloadUrl = files.map(file => ({
      ...file,
      downloadUrl: `/api/file/download/${file.id}`
    }));

    res.json({
      success: true,
      data: filesWithDownloadUrl
    });

  } catch (error) {
    console.error('获取用户文件列表失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取用户文件列表失败'
    });
  }
});

/**
 * 删除文件
 * DELETE /api/file/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    await deleteFile(fileId);

    res.json({
      success: true,
      message: '文件删除成功'
    });

  } catch (error) {
    console.error('文件删除失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '文件删除失败'
    });
  }
});

export default router;
