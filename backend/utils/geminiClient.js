// backend/utils/geminiClient.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiResponse(userPrompt) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: userPrompt }] }]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const candidates = response.data.candidates;
  return candidates?.[0]?.content?.parts?.[0]?.text || '응답 없음';
}
