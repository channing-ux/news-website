// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 從 Render 的環境變數取得 NewsAPI 金鑰
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("❌ Error: API_KEY 未設定！");
}

// 根目錄測試
app.get("/", (req, res) => {
  res.send("News Proxy Server 正常運作中 🚀");
});

// /news 端點
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

    if (!response.ok) {
      const text = await response.text();
