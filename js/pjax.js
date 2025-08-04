// PJAX 配置和初始化
class PjaxManager {
    constructor() {
        this.initPjax();
        this.bindEvents();
    }

    initPjax() {
        // 引入 PJAX 库
        if (typeof Pjax === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://fastly.jsdelivr.net/npm/pjax@0.2.8/pjax.min.js';
            script.onload = () => {
                this.setupPjax();
            };
            document.head.appendChild(script);
        } else {
            this.setupPjax();
        }
    }

    setupPjax() {
        // 初始化 PJAX
        this.pjax = new Pjax({
            elements: 'a[href]:not([data-no-pjax]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])',
            selectors: [
                'title',
                'meta[name="description"]',
                '#main-content',
                '.navbar',
                '.main-footer'
            ],
            switches: {
                '#main-content': Pjax.switches.outerHTML,
                '.navbar': Pjax.switches.outerHTML,
                '.main-footer': Pjax.switches.outerHTML
            },
            cacheBust: false,
            timeout: 10000,
            scrollTo: 0
        });

        console.log('PJAX initialized successfully');
    }

    bindEvents() {
        // PJAX 开始加载
        document.addEventListener('pjax:send', () => {
            this.showLoadingIndicator();
        });

        // PJAX 加载完成
        document.addEventListener('pjax:complete', () => {
            this.hideLoadingIndicator();
            this.reinitializeFeatures();
        });

        // PJAX 加载失败
        document.addEventListener('pjax:error', (event) => {
            console.error('PJAX error:', event);
            this.hideLoadingIndicator();
            // 回退到正常页面跳转
            window.location.href = event.request.responseURL || event.request.url;
        });
    }

    showLoadingIndicator() {
        // 添加加载指示器
        const indicator = document.createElement('div');
        indicator.id = 'pjax-loading';
        indicator.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>加载中...</span>
            </div>
        `;
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        const spinner = indicator.querySelector('.loading-spinner');
        spinner.style.cssText = `
            background: var(--bg-color, #fff);
            padding: 20px 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            color: var(--text-color, #333);
        `;

        const spinnerElement = indicator.querySelector('.spinner');
        spinnerElement.style.cssText = `
            width: 30px;
            height: 30px;
            border: 3px solid var(--border-color, #e0e0e0);
            border-top: 3px solid var(--primary-color, #007bff);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        `;

        // 添加旋转动画
        if (!document.querySelector('#pjax-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'pjax-spinner-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('pjax-loading');
        if (indicator) {
            indicator.remove();
        }
    }

    reinitializeFeatures() {
        console.log('Reinitializing features after PJAX...');

        // 重新初始化国际化
        if (window.i18n) {
            window.i18n.updatePageContent();
            window.i18n.updateLanguageSelector();
            window.i18n.bindLanguageToggle();
        }

        // 重新初始化构建时间
        if (typeof updateBuildTime === 'function') {
            updateBuildTime();
        }

        // 重新初始化主题切换
        this.reinitializeTheme();

        // 重新初始化页面特定功能
        this.reinitializePageFeatures();

        // 重新初始化懒加载和动画
        this.reinitializeLazyLoading();

        // 重新初始化移动端菜单
        this.reinitializeMobileMenu();

        // 触发自定义事件，让其他模块知道页面已重新加载
        document.dispatchEvent(new CustomEvent('pjax:reinitialize'));
    }

    reinitializeTheme() {
        // 重新应用主题
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // 重新绑定主题切换按钮
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.onclick = null; // 移除旧的事件监听器
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    reinitializePageFeatures() {
        const currentPath = window.location.pathname;

        // 移除所有页面特定类
        document.documentElement.classList.remove('dl-page');

        // 首页特定功能
        if (currentPath === '/' || currentPath === '/index.html') {
            this.initializeHomePage();
        }

        // 下载页面特定功能
        if (currentPath.includes('download.html') || currentPath.includes('dl.html')) {
            this.initializeDownloadPage();
            // 为dl.html页面添加特定类
            if (currentPath.includes('dl.html')) {
                document.documentElement.classList.add('dl-page');
            }
        }
    }

    initializeHomePage() {
        // 重新初始化视频控制
        const video = document.querySelector('.hero-video video');
        if (video) {
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.play().catch(e => console.log('Video autoplay failed:', e));
        }

        // 重新初始化平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // 重新初始化统计数字动画
        this.animateCounters();
    }

    initializeDownloadPage() {
        // 下载页面特定的初始化逻辑
        console.log('Initializing download page features');
    }

    reinitializeLazyLoading() {
        // 重新初始化图片懒加载
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    reinitializeMobileMenu() {
        // 重新初始化移动端菜单
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.onclick = null; // 移除旧的事件监听器
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });

            // 点击菜单项时关闭菜单
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }
}

// 初始化 PJAX
document.addEventListener('DOMContentLoaded', () => {
    window.pjaxManager = new PjaxManager();
});