import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

// 定義 /news 端點
app.get("/news", async (req, res) => {
  const category = req.query.category || "general";
  const country = req.query.country || "us";

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

app.get("/", (req, res) => {
  res.send("News Proxy Server 正常運作中 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`伺服器運行在 port ${PORT}`));
