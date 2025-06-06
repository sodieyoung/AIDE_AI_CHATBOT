const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('../utils/pdfParser');

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../uploads')
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('📥 업로드 요청 도착');
    const filePath = req.file.path;

    const text = await extractTextFromPDF(filePath);

    // 파일 삭제 (선택)
    fs.unlink(filePath, err => {
      if (err) console.error('파일 삭제 중 오류:', err);
    });

    res.status(200).json({ success: true, text });
  } catch (err) {
    console.error('❌ 업로드 처리 중 오류:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
