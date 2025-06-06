import express from "express";
import { evaluateAnswerWithModel, evaluateMultipleAnswers } from "../utils/geminiClient.js";

const router = express.Router();

// 개별 답변 피드백 + 모범 답변
router.post("/", async (req, res) => {
  const { answer } = req.body;
  try {
    const feedback = await evaluateAnswerWithModel(answer);
    res.json({ feedback });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "피드백 요청 실패" });
  }
});

// 다수 답변 종합 피드백
router.post("/batch", async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "answers 배열이 필요합니다." });
  }

  try {
    const result = await evaluateMultipleAnswers(answers);
    res.json({ feedback: result });
  } catch (err) {
    console.error("Batch feedback error:", err);
    res.status(500).json({ error: "면접 피드백 생성 실패" });
  }
});

export default router;
