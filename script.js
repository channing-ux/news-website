const backendUrl = "https://news-website-1-5mxd.onrender.com"; // Render URL
const newsContainer = document.getElementById("news-container");
const buttons = document.querySelectorAll(".category");

// 注意：改成 NewsData.io 支援的 category，例如 technology、top
getNews("technology");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    getNews(category);
  });
});

async function getNews(category) {
  newsContainer.innerHTML = "<p>載入中...</p>";
  const url = `${backendUrl}/news?category=${category}&country=us`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // NewsData.io 回傳的新聞陣列欄位是 data.results
    displayNews(data.results);
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = "<p>無法取得新聞資料。</p>";
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p>沒有找到新聞。</p>";
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.image_url || 'https://via.placeholder.com/300x180'}" alt="${article.title}">
      <h3>${article.title}</h3>
      <p>${article.description || ''}</p>
      <a href="${article.link}" target="_blank">閱讀更多</a>
    `;
    newsContainer.appendChild(card);
  });
}
