// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 從環境變數取得 NewsAPI 金鑰
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

  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY 未設定" });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`
    );

    const text = await response.text(); // 先抓原始文字
    let data;
    try {
      data = JSON.parse(text); // 嘗試轉成 JSON
    } catch {
      data = { error: "無法解析 NewsAPI 回傳結果", raw: text };
    }

    if (!response.ok || data.status === "error") {
      console.error("❌ NewsAPI 錯誤內容:", data);
      return res.status(response.status || 500).json({ error: "NewsAPI 錯誤", details: data });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ /news fetch 發生錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 伺服器運行在 port ${PORT}`));
