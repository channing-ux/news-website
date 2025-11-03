// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ 允許跨域請求（支援 GitHub Pages）
app.use(
  cors({
    origin: ["https://channing-ux.github.io"], // 你的前端網址
    methods: ["GET"],
  })
);

const API_KEY = process.env.API_KEY; // Render 上設定的 NewsData.io 金鑰
if (!API_KEY) {
  console.error("❌ Error: API_KEY 未設定！");
}

app.get("/", (req, res) => {
  res.send("✅ News Proxy Server 正常運作中 🚀");
});

app.get("/news", async (req, res) => {
  let category = req.query.category || "top"; // ✅ NewsData.io 不支援 "general"
  const country = req.query.country || "us";

  // ✅ NewsData.io 支援的合法分類清單（2025年）
  const validCategories = [
    "top",
    "world",
    "business",
    "politics",
    "environment",
    "entertainment",
    "sports",
    "science",
    "technology",
    "health",
  ];

  // 🛠️ 若 category 無效，自動改成 "top"
  if (!validCategories.includes(category)) {
    console.warn(`⚠️ 無效分類「${category}」，已改為 "top"`);
    category = "top";
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&category=${category}&language=en`;
    console.log("📡 Fetching:", url);

    const response = await fetch(url);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "❌ 無法解析 NewsData.io 回傳結果", raw: text };
    }

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
