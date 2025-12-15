// script.js
const backendUrl = "https://news-website-1-5mxd.onrender.com"; // Render URL
const newsContainer = document.getElementById("news-container");
const buttons = document.querySelectorAll(".category");

// 預設載入頭條新聞 (top)
getNews("top");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    
    // ⭐ UX 優化：切換 active 狀態
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    getNews(category);
  });
});

async function getNews(category) {
  newsContainer.innerHTML = "<div class='loading'>🚀 正在為您載入「" + category + "」新聞...</div>";
  
  // 這裡使用 country=tw 和 language=zh 來取得臺灣的中文新聞
  const url = `${backendUrl}/news?category=${category}&country=tw&language=zh`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // 處理非 200 狀態碼，例如 Render 伺服器錯誤
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.details.message || "NewsData.io 發生錯誤");
    }
    
    // NewsData.io 回傳的新聞陣列欄位是 data.results
    displayNews(data.results);
  } catch (error) {
    console.error("新聞獲取失敗:", error);
    newsContainer.innerHTML = `<div class="error-message">⚠️ 無法取得新聞資料：${error.message}</div>`;
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p class='no-news'>😔 此分類目前沒有找到新聞。</p>";
    return;
  }

  articles.forEach(article => {
    // 使用 <a> 標籤讓整個卡片可點擊
    const card = document.createElement("a");
    card.href = article.link; // 連結到新聞原始頁面
    card.target = "_blank";
    card.className = "news-card";

    // 格式化日期
    const formattedDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString('zh-TW') : '未知日期';
    
    card.innerHTML = `
      <div class="card-image-wrapper">
                <img src="${article.image_url || 'https://via.placeholder.com/300x180/007bff/ffffff?text=No+Image'}" 
             alt="${article.title}" loading="lazy">
      </div>
      <div class="card-content">
        <h3>${article.title || '無標題新聞'}</h3>
        <p class="description">${article.description || '點擊閱讀全文...'}</p>
        <div class="card-footer">
          <span class="source">${article.source_id || '未知來源'}</span>
          <span class="date">${formattedDate}</span>
        </div>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}