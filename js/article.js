// Article page functionality
class ArticleLoader {
    constructor() {
        this.articleId = this.getArticleId();
        this.basePath = '../';
    }

    getArticleId() {
        const path = window.location.pathname;
        return path.split('/').pop().replace('.html', '');
    }

    async loadArticleData() {
        try {
            const response = await fetch(`${this.basePath}data/articles.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to load article data:', error);
            return null;
        }
    }

    loadBreadcrumb(articleData) {
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        if (breadcrumbNav && articleData.breadcrumbs[this.articleId]) {
            const breadcrumbs = articleData.breadcrumbs[this.articleId].items;
            const breadcrumbHTML = breadcrumbs.map(item => {
                if (item.url) {
                    return `<a href="${item.url}">${item.text}</a>`;
                } else {
                    return `<span>${item.text}</span>`;
                }
            }).join(' > ');
            
            breadcrumbNav.innerHTML = breadcrumbHTML;
        }
    }

    loadArticleMeta(articleData) {
        const articleMeta = document.getElementById('article-meta');
        if (articleMeta && articleData.articleMeta[this.articleId]) {
            const meta = articleData.articleMeta[this.articleId];
            articleMeta.innerHTML = `
                <p><strong>カテゴリー:</strong> ${meta.category}</p>
                <p><strong>難易度:</strong> ${meta.difficulty}</p>
                <p><strong>所要時間:</strong> ${meta.duration}</p>
                <p><strong>最終更新:</strong> ${meta.lastUpdated}</p>
            `;
        }
    }

    async init() {
        const articleData = await this.loadArticleData();
        if (articleData) {
            this.loadBreadcrumb(articleData);
            this.loadArticleMeta(articleData);
        }
    }
}

// Initialize article loader
document.addEventListener('DOMContentLoaded', () => {
    const articleLoader = new ArticleLoader();
    articleLoader.init();
});
