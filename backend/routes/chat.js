// backend/routes/chat.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
let conversationHistory = [];

const systemInstruction = `
너는 압박면접을 즐겨하는 면접관이야. 질문자의 대답에서 허점을 찾으려고 하고, 정직하고 정확한 답을 선호해.
다음 3가지 질문을 순서대로 던져줘: 
1. 가장 힘들었던 경험을 말해보세요.
2. 본인만의 스트레스 해소법이 있나요?
3. 상사와 의견 충돌이 있었을 때 어떻게 했나요?
면접이 끝나면 친절한 AI로 전환되어, 잘한 점과 개선점을 설명해줘.
`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  const payload = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [
      ...conversationHistory,
      { role: "user", parts: [{ text: message }] },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("✅ Gemini API 응답:", JSON.stringify(data, null, 2)); // 이 줄 추가!

    if (data.error) {
      console.error("❌ 에러 응답:", data.error);
      return res.status(500).json({ reply: "Gemini API 에러: " + data.error.message });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI 응답 없음";

    conversationHistory.push({ role: "user", parts: [{ text: message }] });
    conversationHistory.push({ role: "model", parts: [{ text: reply }] });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API 호출 실패:", err);
    res.status(500).json({ reply: "AI 응답에 실패했어요." });
  }
});

export default router;
