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

// 动态光标效果增强
function initCursorEffects() {
    document.querySelectorAll('[data-cursor-effect]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 3D 变换效果
            element.style.transform = `
                perspective(1000px) 
                rotateX(${(y - rect.height/2)/20}deg) 
                rotateY(${-(x - rect.width/2)/20}deg)
                translateZ(10px)
            `;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'none';
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
        
        newMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // 切换汉堡菜单图标
            const spans = newMenuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
        
        // 点击菜单项时关闭菜单
        const menuItems = navMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const spans = newMenuToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });
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