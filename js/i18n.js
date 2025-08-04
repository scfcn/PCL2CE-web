// 多语言支持系统
class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.loadTranslations();
    }

    // 检测浏览器语言
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    // 获取存储的语言设置
    getStoredLanguage() {
        return localStorage.getItem('pcl2-language');
    }

    // 存储语言设置
    setStoredLanguage(lang) {
        localStorage.setItem('pcl2-language', lang);
    }

    // 加载翻译数据
    loadTranslations() {
        this.translations = {
            zh: {
                // 导航栏
                'nav.brand': 'PCL2 社区版',
                'nav.home': '首页',
                'nav.features': '功能特性',
                'nav.download': '下载',
                'nav.about': '关于',
                'nav.github': 'GitHub',
                'nav.lang.zh': '中',
                'nav.lang.en': 'EN',
                
                // 品牌名称
                'brand.name': 'PCL2 社区版',
                'brand.tagline': '开源免费的 Minecraft 启动器',
                
                // 首页标题
                'hero.title': 'PCL2 社区版',
                'hero.subtitle': '开源免费的 Minecraft 启动器',
                'hero.description': '基于龙腾猫跃 PCL2 构建的社区版本，为 Minecraft 玩家提供最好的游戏体验。',
                'hero.download': '下载最新版',
                'hero.history': '历史版本',
                
                // 统计数据
                'stats.users': '活跃用户',
                'stats.opensource': '开源免费',
                'stats.community': '社区支持',
                
                // 演示部分
                'demo.title': 'PCL2 社区版演示视频',
                'demo.description': '观看演示视频，了解 PCL2 社区版的强大功能',
                
                // 功能特性
                'features.title': '功能特性',
                'features.description': 'PCL2 社区版为您提供全面的 Minecraft 游戏管理体验',
                'features.crash.title': '智能崩溃分析',
                'features.crash.description': '自动分析游戏崩溃原因，提供解决方案',
                'features.crash.item1': '自动日志分析',
                'features.crash.item2': '智能错误诊断',
                'features.folder.title': '多文件夹管理',
                'features.folder.description': '支持多个游戏实例管理，不同版本、不同模组包完全隔离，轻松切换游戏环境。',
                'features.folder.item1': '独立游戏实例',
                'features.folder.item2': '版本隔离管理',
                'features.download.title': '资源直接下载',
                'features.download.description': '内置资源商店，支持直接下载光影、材质包、模组等资源，无需手动安装。',
                'features.download.item2': '材质包管理',
                'features.download.item3': '模组一键安装',
                'features.account.title': '多账号支持',
                'features.account.description': '支持多个 Minecraft 账号管理，快速切换不同账号，支持正版和离线模式。',
                'features.account.item1': '多账号管理',
                'features.account.item2': '快速账号切换',
                'features.java.title': 'Java 版本管理',
                'features.java.description': '自动检测和管理 Java 版本，为不同的 Minecraft 版本选择最适合的 Java 环境。',
                'features.java.item1': '自动 Java 检测',
                'features.java.item2': '版本智能匹配',
                'features.opensource.title': '开源免费',
                'features.opensource.description': '完全开源的项目，永久免费使用，社区驱动开发，持续更新和改进。',
                'features.opensource.item1': '完全开源',
                'features.opensource.item2': '永久免费',
                'features.opensource.item3': '社区驱动',
                
                // 界面预览
                'screenshots.title': '界面预览',
                'screenshots.description': '直观了解 PCL2 社区版的界面设计和功能布局',
                'screenshots.main.title': '主界面',
                'screenshots.main.description': '简洁直观的主界面设计，所有功能一目了然。支持深色主题切换，',
                'screenshots.main.item2': '直观的操作体验',
                'screenshots.main.item3': '支持主题切换',
                'screenshots.version.title': '版本管理',
                'screenshots.version.description': '强大的版本管理功能，支持多个 Minecraft 版本同时管理。自动下载和安装，版本切换只需一键操作。支持快照版本、正式版本以及各种模组版本。',
                'screenshots.version.item1': '多版本并存管理',
                'screenshots.version.item2': '自动下载安装和补全文件',
                'screenshots.version.item3': '一键版本切换',
                'screenshots.mods.title': '模组管理',
                'screenshots.mods.description': '便捷的模组安装和管理系统，支持从多个来源下载模组。智能依赖检测，自动解决模组冲突。提供模组搜索、分类和评级功能，让你轻松找到心仪的模组。',
                'screenshots.mods.item1': '智能模组管理',
                'screenshots.mods.item2': '自动依赖检测',
                'screenshots.mods.item4': '模组搜索',
                
                // 下载部分
                'download.title': '立即下载',
                'download.description': '开始你的 Minecraft 之旅，体验最好用的启动器',
                'download.latest': '下载最新版',
                'download.all_versions': '查看所有版本',

                'download.card.title': 'PCL2 社区版',
                'download.card.subtitle': 'Community Edition',
                'download.card.tag1': '开源免费',
                'download.card.tag2': '智能管理',
                'download.card.tag3': '社区支持',
                
                // 关于部分
                'about.title': '关于 PCL 社区',
                'about.description': '非官方的 PCL 社区玩家组织，不代表开发者龙腾猫跃和 PCL 官方。',
                'about.stat1.title': '持续更新',
                'about.stat1.description': '定期发布新功能和修复',
                'about.stat2.title': '安全可靠',
                'about.stat2.description': '开源透明，安全无忧',
                
                // 下载页面
                'download.title': '下载 PCL2 社区版 | 开源免费的Minecraft启动器',
                'dl.title': 'PCL2 社区版下载',
                'dl.stable': '最新稳定版',
                'dl.instruction.step1': '按下 Win + S键打开搜索，搜索 系统信息 并打开。',
                'dl.instruction.step2': '查看 系统类型：',
                'dl.instruction.x64': '若显示 x64 电脑 → 下载 X64 版本。',
                'dl.instruction.arm64': '若显示 ARM64 电脑 → 下载 ARM64 版本。',
                'dl.tip.title': ' 💡 小提示:',
                'dl.tip.x64': '常规台式机/笔记本通常为 X64。',
                'dl.tip.arm64': 'ARM64 主要用于微软 Surface Pro X 等设备。',
                'dl.tip.fallback': '若不确定，优先选 X64（兼容性更广），若不可用再选 ARM64。',
                'dl.x64.title': 'X64 版本',
                'dl.x64.desc': '适用于大多数 Windows 电脑',
                'dl.arm64.title': 'ARM64 版本',
                'dl.arm64.desc': '适用于 ARM 架构的 Windows 电脑',
                'dl.mirror.1': '线路1',
                'dl.mirror.2': '线路2',
                'dl.mirror.github': 'GitHub（境内下载可能较慢）',
                'dl.history.title': '历史版本下载',
                'dl.history.desc': '如果您需要旧版本的 PCL2 社区版，可以从以下链接下载：',
                'dl.history.link': '历史版本',
                
                // 404页面
                '404.title': '页面未找到',
                '404.description': '抱歉，您访问的页面不存在或已被移动。',
                '404.back': '返回首页',
                '404.download': '前往下载',
                
                // 页脚
                'footer.brand': 'PCL2 社区版',
                'footer.tagline': '开源免费的 Minecraft 启动器',
                'footer.description': '基于龙腾猫跃 PCL2 构建的社区版本，为 Minecraft 玩家提供最好的游戏体验。',
                'footer.quicklinks': '快速链接',
                'footer.home': '首页',
                'footer.features': '功能特性',
                'footer.download': '下载',
                'footer.about': '关于我们',
                'footer.about.title': '关于项目',
                'footer.about.description': 'PCL2 社区版是基于龙腾猫跃 PCL2 构建的开源 Minecraft 启动器',
                'footer.resources': '资源下载',
                'footer.resources.title': '资源',
                'footer.latest': '最新版本',
                'footer.history': '历史版本',
                'footer.source': '源代码',
                'footer.community': '社区',
                'footer.community.title': '社区',
                'footer.issues': '问题反馈',
                'footer.discussions': '讨论区',
                'footer.links.github': 'GitHub',
                'footer.links.issues': '问题反馈',
                'footer.links.releases': '版本发布',
                'footer.links.discussions': '讨论区',
                'footer.links.wiki': '使用文档',
                'footer.links.contribute': '贡献指南',
                'footer.links.download': '下载启动器',
                'footer.links.history': '历史版本',
                'footer.links.license': '开源协议',
                'footer.built_by': '网站由',
                'footer.built': '构建',
                'footer.build_time': '构建时间:',
                'footer.based_on': 'PCL2 社区版基于龙腾猫跃 PCL2 构建',
                'footer.language': '简体中文',
                'footer.language.switch': 'English'
            },
            en: {
                // 导航栏
                'nav.brand': 'PCL2 Community Edition',
                'nav.home': 'Home',
                'nav.features': 'Features',
                'nav.download': 'Download',
                'nav.about': 'About',
                'nav.github': 'GitHub',
                'nav.lang.zh': '中',
                'nav.lang.en': 'EN',
                
                // 品牌名称
                'brand.name': 'PCL2 Community Edition',
                'brand.tagline': 'Open-source and free Minecraft launcher',
                
                // 首页标题
                'hero.title': 'PCL2 Community Edition',
                'hero.subtitle': 'Open Source Free Minecraft Launcher',
                'hero.description': 'Powerful Minecraft launcher, providing the best gaming experience. Support multiple versions, mod management, account management and more.',
                'hero.download': 'Download Latest',
                'hero.history': 'Version History',
                
                // 统计数据
                'stats.users': 'Active Users',
                'stats.opensource': 'Open Source',
                'stats.community': 'Community Support',
                
                // 演示部分
                'demo.title': 'PCL2 Community Edition Demo Video',
                'demo.description': 'Watch the demo video to learn about the powerful features of PCL2 Community Edition',
                
                // 功能特性
                'features.title': 'Features',
                'features.description': 'PCL2 Community Edition provides comprehensive Minecraft game management experience',
                'features.crash.title': 'Smart Crash Analysis',
                'features.crash.description': 'Automatically analyze game crash causes and provide solutions',
                'features.crash.item1': 'Auto-detect common issues',
                'features.crash.item2': 'Provide detailed error reports',
                'features.folder.title': 'Multi-folder Management',
                'features.folder.description': 'Support multiple game folders, easily manage different versions',
                'features.folder.item1': 'Independent version management',
                'features.folder.item2': 'Quick switch game directories',
                'features.download.title': 'Direct Resource Download',
                'features.download.description': 'Built-in resource downloader, one-click to get game resources',
                'features.download.item2': 'Auto-select optimal routes',
                'features.download.item3': 'Resume download support',
                'features.account.title': 'Multi-account Support',
                'features.account.description': 'Support multiple login methods, manage multiple game accounts',
                'features.account.item1': 'Microsoft account login',
                'features.account.item2': 'Offline mode support',
                'features.java.title': 'Java Version Management',
                'features.java.description': 'Automatically detect and manage Java versions, select the most suitable Java environment for different Minecraft versions.',
                'features.java.item1': 'Auto Java detection',
                'features.java.item2': 'Smart version matching',
                'features.opensource.title': 'Open Source & Free',
                'features.opensource.description': 'Completely open source project, permanently free to use, community-driven development, continuous updates and improvements.',
                'features.opensource.item1': 'Fully open source',
                'features.opensource.item2': 'Permanently free',
                'features.opensource.item3': 'Community driven',
                
                // 界面预览
                'screenshots.title': 'Interface Preview',
                'screenshots.description': 'Intuitively understand the interface design and functional layout of PCL2 Community Edition',
                'screenshots.main.title': 'Main Interface',
                'screenshots.main.description': 'A simple and intuitive main interface design makes all functions easy to understand at a glance. Supports dark theme switching.',
                'screenshots.main.item2': 'Intuitive operation experience',
                'screenshots.main.item3': 'Theme switching support',
                'screenshots.version.title': 'Version Management',
                'screenshots.version.description': 'Powerful version management system supporting multiple Minecraft versions simultaneously. Auto download and install, version switching with one click. Support snapshot versions, release versions and various mod versions.',
                'screenshots.version.item1': 'Multi-version coexistence',
                'screenshots.version.item2': 'Automatically download, install, and complete files',
                'screenshots.version.item3': 'One-click version switch',
                'screenshots.mods.title': 'Mod Management',
                'screenshots.mods.description': 'Convenient mod installation and management system supporting downloads from multiple sources. Smart dependency detection, automatic conflict resolution. Provides mod search, categorization and rating features.',
                'screenshots.mods.item1': 'Smart mod management',
                'screenshots.mods.item2': 'Auto dependency detection',
                'screenshots.mods.item4': 'Module Search',
                
                // 下载部分
                'download.title': 'Download Now',
                'download.description': 'Start your Minecraft journey with the best launcher experience',
                'download.latest': 'Download Latest',
                'download.all_versions': 'View All Versions',

                'download.card.title': 'PCL2 Community Edition',
                'download.card.subtitle': 'Community Edition',
                'download.card.tag1': 'Open Source & Free',
                'download.card.tag2': 'Smart Management',
                'download.card.tag3': 'Community Support',
                
                // 关于部分
                'about.title': 'About PCL Community',
                'about.description': 'Unofficial PCL community player organization, does not represent developer LTCat or PCL official.',
                'about.stat1.title': 'Continuous Updates',
                'about.stat1.description': 'Regular releases of new features and fixes',
                'about.stat2.title': 'Safe & Reliable',
                'about.stat2.description': 'Open source transparency, worry-free security',
                
                // 页脚
                'footer.brand': 'PCL Community',
                'footer.tagline': 'Community Edition',
                'footer.description': 'Unofficial PCL community player organization, providing open source free Minecraft launcher.',
                'footer.quicklinks': 'Quick Links',
                'footer.home': 'Home',
                'footer.features': 'Features',
                'footer.download': 'Download',
                'footer.about': 'About',
                'footer.about.title': 'About Project',
                'footer.about.description': 'PCL2 Community Edition is an open-source Minecraft launcher based on LTCat PCL2',
                'footer.resources': 'Resources',
                'footer.resources.title': 'Resources',
                'footer.latest': 'Latest Version',
                'footer.history': 'Version History',
                'footer.source': 'Source Code',
                'footer.community': 'Community',
                'footer.community.title': 'Community',
                'footer.issues': 'Issue Feedback',
                'footer.discussions': 'Community Discussions',
                'footer.links.github': 'GitHub',
                'footer.links.issues': 'Issue Feedback',
                'footer.links.releases': 'Releases',
                'footer.links.discussions': 'Discussions',
                'footer.links.wiki': 'Documentation',
                'footer.links.contribute': 'Contributing Guide',
                'footer.links.download': 'Download Launcher',
                'footer.links.history': 'Version History',
                'footer.links.license': 'License',
                'footer.built_by': 'Website built by',
                'footer.built': 'built',
                'footer.build_time': 'Build time:',
                'footer.based_on': 'PCL2 Community Edition based on LTCat PCL2',
                
                // 下载页面
                'download.title': 'Download PCL2 Community Edition | Open Source Free Minecraft Launcher',
                'dl.title': 'PCL2 Community Edition Download',
                'dl.stable': 'Latest Stable Version',
                'dl.instruction.step1': 'Press Win + S to open search, search for \'System Information\' and open it.',
                'dl.instruction.step2': 'Check System Type:',
                'dl.instruction.x64': 'If it shows x64-based PC → Download X64 version.',
                'dl.instruction.arm64': 'If it shows ARM64-based PC → Download ARM64 version.',
                'dl.tip.title': ' 💡 Tips:',
                'dl.tip.x64': 'Regular desktops/laptops are usually X64.',
                'dl.tip.arm64': 'ARM64 is mainly for devices like Microsoft Surface Pro X.',
                'dl.tip.fallback': 'If unsure, choose X64 first (better compatibility), try ARM64 if it doesn\'t work.',
                'dl.x64.title': 'X64 Version',
                'dl.x64.desc': 'For most Windows computers',
                'dl.arm64.title': 'ARM64 Version',
                'dl.arm64.desc': 'For ARM-based Windows computers',
                'dl.mirror.1': 'Mirror 1',
                'dl.mirror.2': 'Mirror 2',
                'dl.mirror.github': 'GitHub (may be slow in China)',
                'dl.history.title': 'Historical Versions Download',
                'dl.history.desc': 'If you need older versions of PCL2 Community Edition, you can download from the following links:',
                'dl.history.link': 'Historical Versions',
                
                // 404页面
                '404.title': 'Page Not Found',
                '404.description': 'Sorry, the page you are looking for does not exist or has been moved.',
                '404.back': 'Back to Home',
                '404.download': 'Go to Download',
                
                // 页脚
                'footer.brand': 'PCL2 Community Edition',
                'footer.tagline': 'Open Source Free Minecraft Launcher',
                'footer.description': 'Community edition based on LTCat PCL2, providing the best gaming experience for Minecraft players.',
                'footer.quicklinks': 'Quick Links',
                'footer.home': 'Home',
                'footer.features': 'Features',
                'footer.download': 'Download',
                'footer.about': 'About Us',
                'footer.resources': 'Resources',
                'footer.latest': 'Latest Version',
                'footer.history': 'Historical Versions',
                'footer.source': 'Source Code',
                'footer.community': 'Community',
                'footer.issues': 'Issue Feedback',
                'footer.discussions': 'Discussions',
                'footer.language': 'English',
                'footer.language.switch': '简体中文'
            }
        };
    }

    // 获取翻译文本
    t(key, defaultText = '') {
        const translation = this.translations[this.currentLang];
        return translation && translation[key] ? translation[key] : (defaultText || key);
    }

    // 切换语言
    switchLanguage(lang) {
        if (lang !== this.currentLang && this.translations[lang]) {
            this.currentLang = lang;
            this.setStoredLanguage(lang);
            this.updatePageContent();
            this.updateLanguageSelector();
            
            // 触发语言切换事件
            window.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            }));
        }
    }

    // 更新页面内容
    updatePageContent() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新页面标题
        const titleKey = document.documentElement.getAttribute('data-title-key');
        if (titleKey) {
            document.title = this.t(titleKey);
        }

        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    }

    // 更新语言选择器
    updateLanguageSelector() {
        const languageLinks = document.querySelectorAll('.language-selector a, .lang-switch');
        languageLinks.forEach(link => {
            const lang = link.getAttribute('data-lang');
            if (lang) {
                // 每个按钮显示固定的语言名称
                if (lang === 'zh') {
                    link.textContent = '简体中文';
                } else if (lang === 'en') {
                    link.textContent = 'English';
                }
                
                // 更新激活状态
                if (lang === this.currentLang) {
                    link.classList.add('active');
                    link.style.fontWeight = 'bold';
                } else {
                    link.classList.remove('active');
                    link.style.fontWeight = 'normal';
                }
            }
        });
    }

    // 初始化
    init() {
        this.updatePageContent();
        this.updateLanguageSelector();
        this.bindLanguageToggle();
        
        // 监听 PJAX 重新初始化事件
        document.addEventListener('pjax:reinitialize', () => {
            this.updatePageContent();
            this.updateLanguageSelector();
            this.bindLanguageToggle();
        });

        // 监听页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updatePageContent();
            });
        }
    }

    // 重新绑定语言切换功能（用于PJAX）
    bindLanguageToggle() {
        // 绑定语言切换事件
        document.addEventListener('click', (e) => {
            const langLink = e.target.closest('[data-lang]');
            if (langLink) {
                e.preventDefault();
                const lang = langLink.getAttribute('data-lang');
                this.switchLanguage(lang);
            }
        });
        
        const langToggle = document.querySelector('.lang-toggle');
        if (langToggle) {
            // 移除旧的事件监听器
            langToggle.onclick = null;
            
            // 添加新的事件监听器
            langToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
                this.switchLanguage(newLang);
            });
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// 创建全局实例
window.i18n = new I18n();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.i18n.init();
    });
} else {
    window.i18n.init();
}