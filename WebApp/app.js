const NEWS_ENDPOINT = "https://localhost:7185/api/NewsArticles";

// 1. Tüm haberleri getiren fonksiyon (GET)
async function getAllNews() {
    const response = await fetch(NEWS_ENDPOINT, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Haberleri çekerken bir hata oluştu: ${response.status} - ${response.statusText} ${text}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

// 2. Gelen haber listesini ekrana kartlar halinde çizen fonksiyon
function renderNewsList(container, items) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = ""; // Panoyu temizle

    items.forEach(item => {
        const articleEl = document.createElement("article");

        const h2 = document.createElement("h2");
        h2.textContent = item.title ?? "(No title)";

        const p = document.createElement("p");
        p.textContent = item.summary ?? "(No summary)";

        articleEl.appendChild(h2);
        articleEl.appendChild(p);

        container.appendChild(articleEl);
    });
}

// 3. Payload nesnesini JSON olarak API'ye gönderen fonksiyon (POST)
async function createNews(payload) {
    const response = await fetch(NEWS_ENDPOINT, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Haber eklenirken bir hata oluştu: ${response.status} - ${response.statusText} ${text}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
        return await response.json();
    }

    return {};
}

// Tarayıcı küresel alanına bağlama
window.NewsClient = {
    getAllNews,
    createNews,
    renderNewsList
};