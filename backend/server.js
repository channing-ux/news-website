// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ 允許跨域請求（含 GitHub Pages 網址）
app.use(cors({
  origin: ["https://channing-ux.github.io"], // 允許你的前端網域
  methods: ["GET"], // 只開放 GET 即可
}));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("❌ Error: API_KEY 未設定！");
}

app.get("/", (req, res) => {
  res.send("News Proxy Server 正常運作中 🚀");
});

app.get("/news", async (req, res) => {
  const category = req.query.category || "general";
  const country = req.query.country || "us";

  try {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&category=${category}&language=en`
    );

    const data = await response.json();

    if (data.status === "error") {
      console.error("❌ NewsData.io 錯誤:", data);
      return res.status(500).json({ error: "NewsData.io 錯誤", details: data });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ /news fetch 發生錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 伺服器運行在 port ${PORT}`));
