'use strict';

// 视频循环控制
const videoFrame = document.getElementById('bili-video'); 
let isVideoLoaded = false;

videoFrame.onload = function () {
    if (!isVideoLoaded) {
        this.contentWindow.postMessage('{"event":"command","func":"loop","args":""}', '*');
        isVideoLoaded = true;
    }
};

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 动态光标效果增强
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
        
        // 动态光晕效果
        element.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(255,255,255,0.2),
                rgba(255,255,255,0.1) 40%,
                transparent 60%
            )
        `;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'none';
        element.style.background = '';
    });
});

// 图片懒加载动画
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    observer.observe(img);
});

// 主题切换增强
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme') || 
                  (prefersDarkScheme.matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', savedTheme);

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

// 优化滚动性能
window.addEventListener('scroll', debounce(() => {
    document.body.style.setProperty('--scroll', window.pageYOffset / 
        (document.documentElement.scrollHeight - window.innerHeight));
}, 10));

// 高级主题切换
const themeToggle = document.querySelector('#theme-toggle');
const body = document.body;

function toggleTheme() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    body.style.transition = 'background 0.6s ease';
    setTimeout(() => body.style.transition = '', 600);
}

// 动态光标效果
document.querySelectorAll('[data-cursor-effect]').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        element.style.transform = `perspective(1000px) rotateX(${(y - rect.height/2)/20}deg) rotateY(${-(x - rect.width/2)/20}deg)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'none';
    });
});

// 初始化主题
if(typeof savedTheme === 'undefined'){
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
}