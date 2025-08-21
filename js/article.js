// Article page functionality
class ArticleLoader {
    constructor() {
        this.articleId = this.getArticleId();
        this.basePath = '../';
    }

    getArticleId() {
        const path = window.location.pathname;
        const articleId = path.split('/').pop().replace('.html', '');
        console.log('Article ID:', articleId);
        return articleId;
    }

    async loadArticleData() {
        try {
            console.log('Loading article data from:', `${this.basePath}data/articles.json`);
            const response = await fetch(`${this.basePath}data/articles.json`);
            const data = await response.json();
            console.log('Article data loaded:', data);
            return data;
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
        console.log('Loading meta for article:', this.articleId);
        const articleMeta = document.getElementById('article-meta');
        console.log('Article meta element:', articleMeta);
        
        if (articleMeta && articleData.articleMeta[this.articleId]) {
            const meta = articleData.articleMeta[this.articleId];
            console.log('Meta data:', meta);
            articleMeta.innerHTML = `
                <p><strong>カテゴリー:</strong> ${meta.category}</p>
                <p><strong>難易度:</strong> ${meta.difficulty}</p>
                <p><strong>所要時間:</strong> ${meta.duration}</p>
                <p><strong>最終更新:</strong> ${meta.lastUpdated}</p>
            `;
            console.log('Meta data loaded successfully');
        } else {
            console.log('No meta data found for article:', this.articleId);
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

// Initialize article loader after common.js has finished
document.addEventListener('DOMContentLoaded', () => {
    // Wait for common.js to finish loading the basic structure
    setTimeout(() => {
        const articleLoader = new ArticleLoader();
        articleLoader.init();
    }, 200);
});
