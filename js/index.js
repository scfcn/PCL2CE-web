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

// 千万别点按钮的奇怪效果
function initDontClickButton() {
    const dontClickBtn = document.getElementById('dontClickBtn');
    const dontClickBtnDownload = document.getElementById('dontClickBtnDownload');
    
    // 奇怪效果数组
    const weirdEffects = [
        // 页面旋转
        () => {
            document.body.style.transition = 'transform 2s ease-in-out';
            document.body.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                document.body.style.transform = '';
                setTimeout(() => document.body.style.transition = '', 100);
            }, 2000);
        },
        
        // 页面颜色反转
        () => {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
        },
        
        // 页面震动
        () => {
            let count = 0;
            const shake = () => {
                if (count < 20) {
                    document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                    count++;
                    setTimeout(shake, 50);
                } else {
                    document.body.style.transform = '';
                }
            };
            shake();
        },
        
        // 页面缩放
        () => {
            document.body.style.transition = 'transform 1s ease-in-out';
            document.body.style.transform = 'scale(0.5)';
            setTimeout(() => {
                document.body.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    document.body.style.transform = '';
                    setTimeout(() => document.body.style.transition = '', 100);
                }, 500);
            }, 1000);
        },
        
        // 彩虹背景
        () => {
            const originalBg = document.body.style.background;
            document.body.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'rainbow 2s ease infinite';
            
            // 添加彩虹动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.background = originalBg;
                document.body.style.animation = '';
                document.head.removeChild(style);
            }, 4000);
        },
        
        // 文字跳舞
        () => {
            const allText = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
            allText.forEach((element, index) => {
                setTimeout(() => {
                    element.style.transition = 'transform 0.5s ease';
                    element.style.transform = 'rotate(10deg) scale(1.1)';
                    setTimeout(() => {
                        element.style.transform = 'rotate(-10deg) scale(0.9)';
                        setTimeout(() => {
                            element.style.transform = '';
                        }, 250);
                    }, 250);
                }, index * 50);
            });
        },
        
        // 重力效果
        () => {
            const elements = document.querySelectorAll('.btn, .card, img');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.transition = 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.transform = 'translateY(100vh) rotate(720deg)';
                    setTimeout(() => {
                        element.style.transform = '';
                    }, 2000);
                }, index * 100);
            });
        },
        
        // 页面模糊
        () => {
            document.body.style.filter = 'blur(10px)';
            setTimeout(() => {
                document.body.style.filter = 'blur(0px)';
            }, 2000);
        },
        
        // 随机移动所有元素
        () => {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                if (element !== document.body && element !== document.html) {
                    element.style.transition = 'transform 1s ease';
                    element.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
                }
            });
            setTimeout(() => {
                elements.forEach(element => {
                    element.style.transform = '';
                });
            }, 2000);
        },
        
        // 页面翻转
        () => {
            document.body.style.transition = 'transform 1.5s ease-in-out';
            document.body.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                document.body.style.transform = '';
                setTimeout(() => document.body.style.transition = '', 100);
            }, 1500);
        }
    ];
    
    // 创建确认菜单
    function createConfirmMenu(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            animation: menuSlideIn 0.3s ease-out;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '你确定吗';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #e74c3c;
            font-size: 20px;
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        for (let i = 0; i < 3; i++) {
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = '确定';
            confirmBtn.style.cssText = `
                background: #e74c3c;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s;
            `;
            
            confirmBtn.addEventListener('mouseenter', () => {
                confirmBtn.style.background = '#c0392b';
            });
            
            confirmBtn.addEventListener('mouseleave', () => {
                confirmBtn.style.background = '#e74c3c';
            });
            
            confirmBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                callback();
            });
            
            buttonContainer.appendChild(confirmBtn);
        }
        
        if (!document.querySelector('#menu-animation')) {
            const style = document.createElement('style');
            style.id = 'menu-animation';
            style.textContent = `
                @keyframes menuSlideIn {
                    0% { opacity: 0; transform: scale(0.7) translateY(-50px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        menu.appendChild(title);
        menu.appendChild(buttonContainer);
        overlay.appendChild(menu);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
    
    // 点击效果处理函数
    function handleDontClick(event) {
        event.preventDefault();
        
        const button = event.target;
        
        // 按钮震动效果
        button.style.animation = 'shake 0.5s ease-in-out';
        
        // 添加震动动画
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
        
        // 执行效果的函数
        function executeEffect() {
            // 随机选择一个效果
            const randomEffect = weirdEffects[Math.floor(Math.random() * weirdEffects.length)];
            randomEffect();
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        }
        
        // 创建确认菜单
        createConfirmMenu(executeEffect);
    }
    
    // dl.html页面的特殊处理函数
    function handleDlPageDontClick(event) {
        event.preventDefault();
        
        const button = event.target;
        
        // 按钮震动效果
        button.style.animation = 'shake 0.5s ease-in-out';
        
        // 添加震动动画
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
        
        // 执行效果的函数
        function executeEffect() {
            // 随机选择一个效果
            const randomEffect = weirdEffects[Math.floor(Math.random() * weirdEffects.length)];
            randomEffect();
            
            // 显示警告消息
            const messages = [
                '我说了千万别点！',
                '警告：请勿继续点击！',
                '你真的很调皮呢！',
                '再点就要出大事了！',
                '还敢再点吗？'
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            // 创建临时消息
            const messageDiv = document.createElement('div');
            messageDiv.textContent = randomMessage;
            messageDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(231, 76, 60, 0.9);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: messagePopup 3s ease-in-out forwards;
            `;
            
            // 添加消息动画
            if (!document.querySelector('#message-animation')) {
                const style = document.createElement('style');
                style.id = 'message-animation';
                style.textContent = `
                    @keyframes messagePopup {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
        
        // 创建确认菜单
        createConfirmMenu(executeEffect);
    }
    
    // 绑定事件
    if (dontClickBtn) {
        dontClickBtn.addEventListener('click', handleDontClick);
    }
    
    if (dontClickBtnDownload) {
        dontClickBtnDownload.addEventListener('click', handleDontClick);
    }
    
    // 为dl.html页面的按钮绑定特殊事件
    const dontClickBtnDl = document.getElementById('dontClickBtnDl');
    if (dontClickBtnDl) {
        dontClickBtnDl.addEventListener('click', handleDlPageDontClick);
    }
}

// 在页面加载完成后初始化按钮效果
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
    initDontClickButton();
});

// 支持PJAX重新初始化时也要初始化按钮
document.addEventListener('pjax:reinitialize', () => {
    initializeAll();
    initDontClickButton();
});