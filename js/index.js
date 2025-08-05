'use strict';

// 全局变量
let isVideoLoaded = false;
let observer = null;

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 视频循环控制
function initVideoControl() {
    const videoFrame = document.getElementById('bili-video'); 
    
    if (videoFrame) {
        videoFrame.onload = function () {
            if (!isVideoLoaded) {
                this.contentWindow.postMessage('{"event":"command","func":"loop","args":""}', '*');
                isVideoLoaded = true;
            }
        };
    }
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 检测是否为桌面设备
function isDesktop() {
    return window.innerWidth > 768 && !('ontouchstart' in window);
}



// 动态光标效果增强
function initCursorEffects() {
    // 只在桌面设备上启用鼠标跟随效果
    if (!isDesktop()) return;
    
    document.querySelectorAll('[data-cursor-effect]').forEach(element => {
        let isAnimating = false;
        let lastTime = 0;
        
        // 缓存元素尺寸，避免重复计算
        let cachedRect = null;
        let rectUpdateTime = 0;
        
        const updateRect = () => {
            const now = Date.now();
            if (!cachedRect || now - rectUpdateTime > 100) {
                cachedRect = element.getBoundingClientRect();
                rectUpdateTime = now;
            }
            return cachedRect;
        };
        
        const handleMouseMove = (e) => {
            const now = performance.now();
            if (now - lastTime < 33) return; // 限制到30fps
            lastTime = now;
            
            if (isAnimating) return;
            isAnimating = true;
            
            requestAnimationFrame(() => {
                const rect = updateRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (element.classList.contains('hero-image-container')) {
                    // 进一步简化计算
                    const centerX = rect.width >> 1; // 使用位运算
                    const centerY = rect.height >> 1;
                    const rotateX = 5 + (y - centerY) * 0.05;
                    const rotateY = -5 - (x - centerX) * 0.05;
                    
                    // 使用transform3d强制GPU加速
                    element.style.transform = `translate3d(0,0,8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
                isAnimating = false;
            });
        };
        
        element.addEventListener('mousemove', handleMouseMove, { passive: true });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            cachedRect = null;
        });
        
        // 窗口大小改变时清除缓存
        window.addEventListener('resize', () => {
            cachedRect = null;
        });
    });
}

// 渐入动画系统
function initScrollAnimations() {
    // 清理之前的observer
    if (observer) {
        observer.disconnect();
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animateElements = document.querySelectorAll(`
        .animate-on-scroll,
        .animate-fade-in,
        .animate-slide-up,
        .animate-slide-left,
        .animate-slide-right,
        .animate-scale-in,
        img[loading="lazy"]
    `);

    animateElements.forEach(element => {
        // 为懒加载图片添加默认动画类
        if (element.tagName === 'IMG' && element.hasAttribute('loading')) {
            element.classList.add('animate-fade-in');
        }
        observer.observe(element);
    });
}

// 页面加载动画
function initPageLoadAnimation() {
    // 为body添加页面进入动画
    document.body.classList.add('page-enter');
    
    // 立即触发导航栏元素的动画
    const navElements = document.querySelectorAll(`
        .navbar .animate-fade-in,
        .navbar .animate-slide-left,
        .navbar .animate-slide-right,
        .navbar .animate-scale-in
    `);
    
    navElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 100); // 每个元素延迟100ms
    });
    
    // 为主要区块添加渐入动画
    const mainSections = document.querySelectorAll(`
        .hero,
        .features,
        .screenshots,
        .about,
        .footer,
        .download-container,
        .version-card
    `);
    
    mainSections.forEach((section, index) => {
        if (section && !section.classList.contains('animate-on-scroll')) {
            section.classList.add('animate-on-scroll');
            if (index > 0) {
                section.classList.add(`animate-delay-${Math.min(index, 6)}`);
            }
        }
    });
}

// 主题初始化
function initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 语言切换功能
function initLanguageSelector() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangSpan = document.getElementById('currentLang');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (!languageToggle || !languageDropdown) return;
    
    // 语言名称映射
    const languageNames = {
        'zh': '🇨🇳 简体中文',
        'en': '🇺🇸 English'
    };
    
    // 初始化当前语言显示
    function updateCurrentLanguage() {
        const currentLang = window.i18n ? window.i18n.currentLang : 'zh';
        if (currentLangSpan) {
            currentLangSpan.textContent = languageNames[currentLang] || '简体中文';
        }
        
        // 更新选项的激活状态
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.classList.toggle('active', lang === currentLang);
        });
    }
    
    // 切换下拉菜单显示
    function toggleDropdown() {
        const isShow = languageDropdown.classList.contains('show');
        languageDropdown.classList.toggle('show', !isShow);
        languageToggle.classList.toggle('active', !isShow);
    }
    
    // 点击切换按钮
    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // 点击语言选项
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            
            if (window.i18n && selectedLang !== window.i18n.currentLang) {
                window.i18n.setLanguage(selectedLang);
                updateCurrentLanguage();
            }
            
            // 关闭下拉菜单
            languageDropdown.classList.remove('show');
            languageToggle.classList.remove('active');
        });
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('show');
        languageToggle.classList.remove('active');
    });
    
    // 阻止下拉菜单内部点击事件冒泡
    languageDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 初始化显示
    updateCurrentLanguage();
    
    // 监听语言变化事件
    document.addEventListener('languageChanged', updateCurrentLanguage);
}

// 高级主题切换
function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    body.style.transition = 'background 0.6s ease';
    setTimeout(() => body.style.transition = '', 600);
}

// 移动端菜单适配
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        // 移除之前的事件监听器
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        function toggleMenu() {
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            newMenuToggle.classList.toggle('active');
            
            // 防止背景滚动
            document.body.style.overflow = isActive ? '' : 'hidden';
        }
        
        function closeMenu() {
            navMenu.classList.remove('active');
            newMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        newMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // 点击菜单外部关闭菜单
        navMenu.addEventListener('click', function(e) {
            if (e.target === navMenu) {
                closeMenu();
            }
        });
        
        // 点击菜单项时关闭菜单
        const menuItems = navMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
}

// 更新当前年份
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// 初始化所有功能
function initializeAll() {
    initVideoControl();
    initSmoothScroll();
    initCursorEffects();
    initPageLoadAnimation();
    initScrollAnimations();
    initTheme();
    initLanguageSelector();
    initMobileMenu();
    updateCurrentYear();
}

// 优化滚动性能（只需要初始化一次）
if (!window.scrollListenerAdded) {
    window.addEventListener('scroll', debounce(() => {
        document.body.style.setProperty('--scroll', window.pageYOffset / 
            (document.documentElement.scrollHeight - window.innerHeight));
    }, 10));
    window.scrollListenerAdded = true;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeAll);

// 支持PJAX重新初始化
document.addEventListener('pjax:reinitialize', initializeAll);