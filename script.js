// script.js (新增設定功能)
const backendUrl = "https://news-website-1-5mxd.onrender.com"; 
const newsContainer = document.getElementById("news-container");
const categoryButtons = document.querySelectorAll(".category");
const langButtons = document.querySelectorAll(".lang-btn");
const fontButtons = document.querySelectorAll(".font-btn");
const themeButtons = document.querySelectorAll(".theme-btn");
const body = document.body;

// ⭐ 新增：追蹤當前狀態
let currentLanguage = 'zh'; // 預設中文
let currentCategory = 'top'; // 預設頭條

// 載入預設新聞
getNews(currentCategory, currentLanguage);

// --- 語言切換邏輯 ---
langButtons.forEach(button => {
    button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang");
        
        // 1. 更新按鈕 active 狀態
        langButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // 2. 更新語言並重新獲取新聞
        currentLanguage = lang;
        getNews(currentCategory, currentLanguage);
        
        // 3. 調整字體 family 以優化顯示
        body.setAttribute('data-lang', currentLanguage);
    });
});


// --- 分類切換邏輯 (稍微調整，確保使用 currentLanguage) ---
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.getAttribute("data-category");
        
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        getNews(currentCategory, currentLanguage);
    });
});


// --- 字體大小調整邏輯 ---
let fontSizeLevel = 0; // -2, -1, 0, +1, +2
fontButtons.forEach(button => {
    button.addEventListener("click", () => {
        const adjustment = parseInt(button.getAttribute("data-size"));
        
        fontSizeLevel = Math.max(-2, Math.min(2, fontSizeLevel + adjustment));
        
        // 將等級設置為 body 的 class 或 attribute
        body.className = body.className.replace(/font-size-\w/g, '').trim();
        if (fontSizeLevel !== 0) {
            body.classList.add(`font-size-${fontSizeLevel > 0 ? 'plus' : 'minus'}${Math.abs(fontSizeLevel)}`);
        }
    });
});

// --- 顏色主題切換邏輯 ---
themeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const theme = button.getAttribute("data-theme");
        
        // 更新按鈕 active 狀態
        themeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // 將主題 class 設置給 body
        body.classList.remove('theme-light', 'theme-dark');
        body.classList.add(`theme-${theme}`);
    });
});


// --- 核心獲取新聞函式 (修改以接受語言參數) ---
async function getNews(category, language) {
    newsContainer.innerHTML = `<div class='loading'>🚀 正在為您載入 ${language === 'zh' ? '中文' : 'English'}「${category}」新聞...</div>`;
  
    // ⭐ 關鍵修正：將語言參數傳遞給後端
    const country = (language === 'zh') ? 'tw' : 'us'; 
    const url = `${backendUrl}/news?category=${category}&country=${country}&language=${language}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP Error: ${errorData.message || response.status}`);
        }

        const data = await response.json();

        if (data.status === "error") {
            throw new Error(data.details?.message || "NewsData.io 發生錯誤");
        }
        
        displayNews(data.results);
    } catch (error) {
        console.error("新聞獲取失敗:", error);
        newsContainer.innerHTML = `<div class="error-message">⚠️ 無法取得新聞資料：${error.message}</div>`;
    }
}

// 渲染新聞函式 (與之前相同，但確保內容使用正確的語言字體)
function displayNews(articles) {
    // ... (渲染邏輯與上一個版本相同，不需要修改) ...
    // 為了保持程式碼簡潔，這裡省略了 displayNews 的重複內容。
    // 請使用上一個版本中完整的 displayNews 函式。

    // 以下為簡略版，請使用完整的 displayNews 函式
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; 
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = "<p class='no-news'>😔 此分類目前沒有找到新聞。</p>";
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("a");
        card.href = article.link; 
        card.target = "_blank";
        card.className = "news-card";

        const formattedDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString(currentLanguage === 'zh' ? 'zh-TW' : 'en-US') : 'Unknown Date';
        
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${article.image_url || 'https://via.placeholder.com/300x180/007bff/ffffff?text=No+Image'}" 
                    alt="${article.title}" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${article.title || '無標題新聞'}</h3>
                <p class="description">${article.description || (currentLanguage === 'zh' ? '點擊閱讀全文...' : 'Click to read more...')}</p>
                <div class="card-footer">
                    <span class="source">${article.source_id || (currentLanguage === 'zh' ? '未知來源' : 'Unknown Source')}</span>
                    <span class="date">${formattedDate}</span>
                </div>
            </div>
        `;
        newsContainer.appendChild(card);
    });
    // script.js (請在文件載入邏輯中新增此行)

// ⭐ 關鍵修正：確保網頁載入時 body 具備預設的 'theme-light' Class
// 這樣 CSS 才能從一開始就正確設定淺色模式的樣式。
body.classList.add('theme-light');
}