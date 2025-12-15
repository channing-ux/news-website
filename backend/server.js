// server.js (優化版)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ 允許跨域請求（支援 GitHub Pages）
app.use(
  cors({
    // 這裡可以列出所有允許的來源，例如您的 GitHub Pages URL
    origin: ["https://channing-ux.github.io"], 
    methods: ["GET"],
  })
);

const API_KEY = process.env.API_KEY; // Render 上設定的 NewsData.io 金鑰
if (!API_KEY) {
  console.error("❌ Error: API_KEY 未設定！");
}

app.get("/", (req, res) => {
  // 顯示伺服器狀態
  res.send("✅ News Proxy Server 正常運作中 🚀");
});

app.get("/news", async (req, res) => {
  // 從前端獲取參數
  let category = req.query.category || "top"; 
  const country = req.query.country || "tw"; // 預設國家設為台灣
  const language = req.query.language || "zh"; // ⭐ 預設語言設為中文

  // NewsData.io 支援的合法分類清單
  const validCategories = [
    "top", "world", "business", "politics", "environment", 
    "entertainment", "sports", "science", "technology", "health",
  ];

  // 🛠️ 若 category 無效，自動改成 "top"
  if (!validCategories.includes(category)) {
    console.warn(`⚠️ 無效分類「${category}」，已改為 "top"`);
    category = "top";
  }

  if (!API_KEY) {
    return res.status(500).json({ status: "error", message: "伺服器 API 金鑰未配置" });
  }

  try {
    // 構建 NewsData.io 請求 URL
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&category=${category}&language=${language}`;
    console.log(`📡 Fetching: ${category} news for ${country}/${language}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsData.io HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 檢查 NewsData.io 回傳的狀態
    if (data.status === "error") {
      console.error("❌ NewsData.io 錯誤:", data);
      return res.status(data.code === "rateLimited" ? 429 : 500).json({ 
        status: "error", 
        message: `NewsData.io 錯誤: ${data.results.message || data.results.code}`,
        details: data 
      });
    }

    // 成功，回傳 NewsData.io 的完整數據
    res.json(data);

  } catch (error) {
    console.error("❌ /news 路由發生錯誤:", error.message);
    res.status(500).json({ status: "error", message: "伺服器內部錯誤", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 伺服器運行在 port ${PORT}`));