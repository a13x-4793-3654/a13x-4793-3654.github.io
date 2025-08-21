// Common site functionality - Load before main script
class SiteLoader {
    constructor() {
        this.commonData = null;
        this.contentData = null;
        this.currentPage = this.getCurrentPage();
        this.basePath = this.getBasePath();
    }

    getBasePath() {
        const path = window.location.pathname;
        // If we're in a subdirectory, we need to go up one level
        if (path.includes('/articles/') || path.includes('\\articles\\')) {
            return '../';
        }
        return '';
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        
        // If we're in the articles directory, return the filename as is
        if (path.includes('/articles/') || path.includes('\\articles\\')) {
            return fileName;
        }
        
        // Check for specific page names
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

    async loadContentData() {
        try {
            const response = await fetch(`${this.basePath}data/content.json`);
            this.contentData = await response.json();
            return this.contentData;
        } catch (error) {
            console.error('Failed to load content data:', error);
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

    loadPageContent() {
        if (!this.contentData || !this.contentData.pages[this.currentPage]) return;
        
        const pageData = this.contentData.pages[this.currentPage];
        
        // Load content based on current page
        switch(this.currentPage) {
            case 'index':
                this.loadIndexContent(pageData);
                break;
            case 'about':
                this.loadAboutContent(pageData);
                break;
            case 'howto':
                this.loadHowtoContent(pageData);
                break;
        }
    }

    loadIndexContent(pageData) {
        // Load hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle && pageData.hero) {
            heroTitle.textContent = pageData.hero.title;
        }
        if (heroDescription && pageData.hero) {
            heroDescription.innerHTML = pageData.hero.description;
        }
        if (heroButtons && pageData.hero && pageData.hero.buttons) {
            heroButtons.innerHTML = pageData.hero.buttons.map(button => 
                `<a href="${button.href}" class="btn ${button.class}">${button.text}</a>`
            ).join('');
        }

        // Load features section
        const sectionTitle = document.querySelector('.section-title');
        const featuresGrid = document.querySelector('.features-grid');
        
        if (sectionTitle && pageData.features) {
            sectionTitle.textContent = pageData.features.title;
        }
        if (featuresGrid && pageData.features && pageData.features.items) {
            featuresGrid.innerHTML = pageData.features.items.map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    }

    loadAboutContent(pageData) {
        // Load page header
        const pageHeader = document.querySelector('.page-header h1');
        const pageSubtitle = document.querySelector('.page-header p');
        
        if (pageHeader && pageData.header) {
            pageHeader.textContent = pageData.header.title;
        }
        if (pageSubtitle && pageData.header) {
            pageSubtitle.textContent = pageData.header.subtitle;
        }

        // Load profile section
        if (pageData.profile) {
            const avatar = document.querySelector('.avatar');
            const profileName = document.querySelector('.profile-info h2');
            const profileTitle = document.querySelector('.profile-title');
            const profileDescription = document.querySelector('.profile-description');
            
            if (avatar) avatar.textContent = pageData.profile.avatar;
            if (profileName) profileName.textContent = pageData.profile.name;
            if (profileTitle) profileTitle.textContent = pageData.profile.title;
            if (profileDescription) profileDescription.innerHTML = pageData.profile.description;
        }

        // Load skills section
        if (pageData.skills) {
            const skillsTitle = document.querySelector('.skills-section h3');
            const skillsGrid = document.querySelector('.skills-grid');
            const noteBox = document.querySelector('.note-box p');
            
            if (skillsTitle) skillsTitle.textContent = pageData.skills.title;
            if (skillsGrid && pageData.skills.categories) {
                skillsGrid.innerHTML = pageData.skills.categories.map(category => `
                    <div class="skill-item">
                        <h4>${category.title}</h4>
                        <ul>
                            ${category.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            }
            if (noteBox && pageData.skills.note) {
                noteBox.innerHTML = `<strong>注：</strong> ${pageData.skills.note}`;
            }
        }

        // Load other sections (experience, hobbies, social, contact, english)
        this.loadAboutExperience(pageData.experience);
        this.loadAboutHobbies(pageData.hobbies);
        this.loadAboutSocial(pageData.social);
        this.loadAboutContact(pageData.contact);
        this.loadAboutEnglish(pageData.english);
    }

    loadAboutExperience(experienceData) {
        if (!experienceData) return;
        
        const experienceTitle = document.querySelector('.experience-section h3');
        const timeline = document.querySelector('.timeline');
        
        if (experienceTitle) experienceTitle.textContent = experienceData.title;
        if (timeline && experienceData.items) {
            timeline.innerHTML = experienceData.items.map(item => `
                <div class="timeline-item">
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    loadAboutHobbies(hobbiesData) {
        if (!hobbiesData) return;
        
        const hobbiesTitle = document.querySelector('.hobbies-section h3');
        const hobbiesContent = document.querySelector('.hobbies-content');
        
        if (hobbiesTitle) hobbiesTitle.textContent = hobbiesData.title;
        if (hobbiesContent && hobbiesData.items) {
            hobbiesContent.innerHTML = hobbiesData.items.map(hobby => `
                <div class="hobby-item">
                    <h4>${hobby.icon} ${hobby.title}</h4>
                    <p>${hobby.description}</p>
                </div>
            `).join('');
        }
    }

    loadAboutSocial(socialData) {
        if (!socialData) return;
        
        const socialTitle = document.querySelector('.social-accounts-section h3');
        const socialDescription = document.querySelector('.social-accounts-section > p');
        const accountsGrid = document.querySelector('.accounts-grid');
        
        if (socialTitle) socialTitle.textContent = socialData.title;
        if (socialDescription) socialDescription.textContent = socialData.description;
        if (accountsGrid && socialData.accounts) {
            accountsGrid.innerHTML = socialData.accounts.map(account => `
                <div class="account-item">
                    <h4>${account.name}</h4>
                    <p>${account.description}</p>
                    <a href="${account.url}" target="_blank" class="social-link">${account.handle}</a>
                </div>
            `).join('');
        }
    }

    loadAboutContact(contactData) {
        if (!contactData) return;
        
        const contactTitle = document.querySelector('.contact-section h3');
        const contactDescription = document.querySelector('.contact-section > p');
        const emailContact = document.querySelector('.email-contact');
        const contactLinks = document.querySelector('.contact-links');
        const privacyNote = document.querySelector('.privacy-note p');
        
        if (contactTitle) contactTitle.textContent = contactData.title;
        if (contactDescription) contactDescription.textContent = contactData.description;
        if (emailContact && contactData.email) {
            emailContact.innerHTML = `
                <h4>${contactData.email.title}</h4>
                <p><strong>${contactData.email.address}</strong></p>
                <p class="note">${contactData.email.note}</p>
            `;
        }
        if (contactLinks && contactData.links) {
            contactLinks.innerHTML = contactData.links.map(link => `
                <a href="${link.url}" target="_blank" class="contact-link">${link.text}</a>
            `).join('');
        }
        if (privacyNote && contactData.privacy) {
            privacyNote.innerHTML = `<strong>プライバシーについて：</strong><br>${contactData.privacy}`;
        }
    }

    loadAboutEnglish(englishData) {
        if (!englishData) return;
        
        const englishTitle = document.querySelector('.english-section h3');
        if (englishTitle) englishTitle.textContent = englishData.title;
        
        // Load English content structure would be complex, keeping existing static content for now
        // This can be enhanced later if needed
    }

    loadHowtoContent(pageData) {
        // Load page header
        const pageHeader = document.querySelector('.page-header h1');
        const pageSubtitle = document.querySelector('.page-header p');
        
        if (pageHeader && pageData.header) {
            pageHeader.textContent = pageData.header.title;
        }
        if (pageSubtitle && pageData.header) {
            pageSubtitle.textContent = pageData.header.subtitle;
        }

        // Load search placeholder
        const searchInput = document.getElementById('search');
        if (searchInput && pageData.search) {
            searchInput.setAttribute('placeholder', pageData.search.placeholder);
        }

        // Load categories
        const categoriesTitle = document.querySelector('.howto-categories h2');
        const categoryGrid = document.querySelector('.category-grid');
        
        if (categoriesTitle && pageData.categories) {
            categoriesTitle.textContent = pageData.categories.title;
        }
        if (categoryGrid && pageData.categories && pageData.categories.items) {
            categoryGrid.innerHTML = pageData.categories.items.map(category => `
                <div class="category-card" data-category="${category.id}">
                    <div class="category-icon">${category.icon}</div>
                    <h3>${category.title}</h3>
                    <p>${category.description}</p>
                </div>
            `).join('');
        }

        // Load articles
        const articlesTitle = document.querySelector('.howto-articles h2');
        const articlesList = document.getElementById('articles-list');
        
        if (articlesTitle && pageData.articles) {
            articlesTitle.textContent = pageData.articles.title;
        }
        if (articlesList && pageData.articles && pageData.articles.items) {
            articlesList.innerHTML = pageData.articles.items.map(article => `
                <article class="howto-article" data-category="${article.category}">
                    <div class="howto-article-header">
                        <span class="article-category">${article.categoryName}</span>
                        <span class="article-date">${article.date}</span>
                    </div>
                    <h3><a href="${article.url}"${article.external ? ' target="_blank"' : ''}>${article.title}</a></h3>
                    <p>${article.description}</p>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </article>
            `).join('');
        }

        // Re-initialize category filtering after content is loaded
        setTimeout(() => {
            this.initializeCategoryFiltering();
        }, 100);
    }

    initializeCategoryFiltering() {
        // Category filtering
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const articles = document.querySelectorAll('.howto-article');

                articles.forEach(article => {
                    const articleCategory = article.getAttribute('data-category');
                    
                    if (articleCategory === category || !category) {
                        article.style.display = 'block';
                        article.style.animation = 'fadeInUp 0.3s ease-out';
                    } else {
                        article.style.display = 'none';
                    }
                });

                // Visual feedback for selected category
                categoryCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    async init() {
        await this.loadCommonData();
        await this.loadContentData();
        if (this.commonData) {
            this.createMetaTags(this.currentPage);
            this.loadHeader();
            this.loadFooter();
        }
        if (this.contentData) {
            this.loadPageContent();
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
