// backend/controllers/uploadController.js
import fs from 'fs';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { getGeminiResponse } from '../utils/geminiClient.js';

export async function handlePDFUpload(req, res) {
  try {
    const filePath = req.file.path;
    const text = await extractTextFromPDF(filePath);

    // Gemini API 호출
    const questionPrompt = `
다음은 사용자의 이력서입니다.

---
${text}
---

이 이력서를 간단히 요약하고, 예상 면접 질문 3개를 만들어주세요.
형식:
1. [질문 1]
2. [질문 2]
3. [질문 3]
    `.trim();

    const response = await getGeminiResponse(questionPrompt);

    fs.unlink(filePath, err => {
      if (err) console.error('❌ 파일 삭제 중 오류:', err);
    });

    res.status(200).json({ success: true, text, geminiResult: response });
  } catch (error) {
    console.error('❌ 업로드 처리 중 오류:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
