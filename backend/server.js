// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 從環境變數取得 NewsData.io 金鑰
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("❌ Error: API_KEY 未設定！");
}

app.get("/", (req, res) => {
  res.send("📰 NewsData.io Proxy Server 正常運作中 🚀");
});

// /news endpoint
app.get("/news", async (req, res) => {
  const category = req.query.category || "top";
  const country = req.query.country || "us";
  const language = req.query.language || "en";

  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY 未設定" });
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&category=${category}&language=${language}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      console.error("❌ NewsData.io 錯誤內容:", data);
      return res.status(response.status || 500).json({ error: "NewsData.io 錯誤", details: data });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ /news fetch 發生錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 伺服器運行在 port ${PORT}`));
