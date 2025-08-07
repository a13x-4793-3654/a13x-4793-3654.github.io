// Common site functionality - Load before main script
class SiteLoader {
    constructor() {
        this.commonData = null;
        this.currentPage = this.getCurrentPage();
        this.basePath = this.getBasePath();
    }

    getBasePath() {
        const path = window.location.pathname;
        // If we're in a subdirectory, we need to go up one level
        if (path.includes('/howto/') || path.includes('\\howto\\')) {
            return '../';
        }
        return '';
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        
        // Check for specific file names first
        if (fileName === 'github-pages-setup') return 'github-pages-setup';
        if (path.includes('about')) return 'about';
        if (path.includes('howto')) return 'howto';
        return 'index';
    }

    async loadCommonData() {
        try {
            const response = await fetch(`${this.basePath}data/common.json`);
            this.commonData = await response.json();
            return this.commonData;
        } catch (error) {
            console.error('Failed to load common data:', error);
            return null;
        }
    }

    createMetaTags(pageKey) {
        const head = document.head;
        const pageData = this.commonData.pages[pageKey];
        const meta = this.commonData.meta;

        // Set title
        document.title = pageData.title;

        // Create meta tags
        const charset = document.createElement('meta');
        charset.setAttribute('charset', meta.charset);
        head.appendChild(charset);

        const viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', meta.viewport);
        head.appendChild(viewport);

        // Add font preconnects
        meta.fonts.preconnect.forEach(url => {
            const link = document.createElement('link');
            link.setAttribute('rel', 'preconnect');
            link.setAttribute('href', url);
            if (url.includes('gstatic')) link.setAttribute('crossorigin', '');
            head.appendChild(link);
        });

        // Add font stylesheet
        const fontLink = document.createElement('link');
        fontLink.setAttribute('rel', 'stylesheet');
        fontLink.setAttribute('href', meta.fonts.stylesheet);
        head.appendChild(fontLink);

        // Add CSS
        const cssLink = document.createElement('link');
        cssLink.setAttribute('rel', 'stylesheet');
        cssLink.setAttribute('href', `${this.basePath}${meta.css}`);
        head.appendChild(cssLink);
    }

    updateNavigationLinks() {
        // Update navigation links to use correct paths
        if (this.basePath) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('../')) {
                    link.setAttribute('href', this.basePath + href);
                }
            });
            
            // Update logo link as well
            const logoLink = document.querySelector('.nav-logo a');
            if (logoLink) {
                logoLink.setAttribute('href', this.basePath + 'index.html');
            }
        }
    }

    loadHeader() {
        const headerContainer = document.getElementById('header-placeholder');
        if (headerContainer && this.commonData) {
            headerContainer.innerHTML = this.commonData.header.html;
            
            // Update navigation links for subdirectories
            this.updateNavigationLinks();
            
            // Set active navigation
            const navLinks = headerContainer.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === this.currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    loadFooter() {
        const footerContainer = document.getElementById('footer-placeholder');
        if (footerContainer && this.commonData) {
            footerContainer.innerHTML = this.commonData.footer.html;
        }
    }

    async init() {
        await this.loadCommonData();
        if (this.commonData) {
            this.createMetaTags(this.currentPage);
            this.loadHeader();
            this.loadFooter();
        }
    }
}

// Initialize site loader
const siteLoader = new SiteLoader();

// Load common parts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => siteLoader.init());
} else {
    siteLoader.init();
}
