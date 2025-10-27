const backendUrl = "https://newsproxy-render.onrender.com"; // ← 改成你的 Render 網址
const newsContainer = document.getElementById("news-container");
const buttons = document.querySelectorAll(".category");

getNews("general");

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
    displayNews(data.articles);
  } catch (error) {
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
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}">
      <h3>${article.title}</h3>
      <p>${article.description || ''}</p>
      <a href="${article.url}" target="_blank">閱讀更多</a>
    `;
    newsContainer.appendChild(card);
  });
}
