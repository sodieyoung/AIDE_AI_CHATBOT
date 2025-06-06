const express = require('express');
const uploadRouter = require('./routes/upload'); // ✅ require로 수정

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', uploadRouter);

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
