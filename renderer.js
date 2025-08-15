// 乐乐浏览器 - 前端逻辑文件
console.log('🚀 乐乐浏览器前端脚本开始加载...');

// 全局变量
let tabCounter = 1;
let currentTabId = 1;
let tabs = new Map();

// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        searchUrl: 'https://www.google.com/search?q=',
        homepage: 'https://www.google.com'
    },
    baidu: {
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        homepage: 'https://www.baidu.com'
    },
    bing: {
        name: 'Bing',
        searchUrl: 'https://www.bing.com/search?q=',
        homepage: 'https://www.bing.com'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        searchUrl: 'https://duckduckgo.com/?q=',
        homepage: 'https://duckduckgo.com'
    }
};

// 默认设置
let currentSearchEngine = 'google';

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成，开始初始化...');
    
    // 初始化浏览器
    initializeBrowser();
    
    console.log('🎉 乐乐浏览器初始化完成！');
});

// 初始化浏览器功能
function initializeBrowser() {
    // 初始化标签页
    initializeTabs();
    
    // 设置所有事件监听器
    setupEventListeners();
    
    // 更新状态
    updateStatus('乐乐浏览器已就绪');
}

// 初始化标签页
function initializeTabs() {
    tabs.set(1, {
        id: 1,
        title: '新标签页',
        url: '',
        loading: false
    });
}

// 设置事件监听器
function setupEventListeners() {
    console.log('⚙️ 设置事件监听器...');
    
    // 地址栏搜索
    const urlInput = document.getElementById('urlInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // 主页搜索
    const mainSearch = document.getElementById('mainSearch');
    const mainSearchBtn = document.getElementById('mainSearchBtn');
    
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMainSearch();
            }
        });
    }
    
    if (mainSearchBtn) {
        mainSearchBtn.addEventListener('click', handleMainSearch);
    }
    
    // 导航按钮
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const homeBtn = document.getElementById('homeBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            navigateWebview('back');
        });
    }
    
    if (forwardBtn) {
        forwardBtn.addEventListener('click', function() {
            navigateWebview('forward');
        });
    }
    
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function() {
            navigateWebview('reload');
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            goHome();
        });
    }
    
    // 新标签页按钮
    const newTabBtn = document.querySelector('.new-tab-btn');
    if (newTabBtn) {
        newTabBtn.addEventListener('click', function() {
            createNewTab();
        });
    }
    
    // 设置按钮
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            toggleSettings();
        });
    }
    
    // 快速访问链接
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                loadUrl(url);
            }
        });
    });
    
    // 标签页关闭按钮
    const tabCloseButtons = document.querySelectorAll('.tab-close');
    tabCloseButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // 由于只有一个标签页，不执行关闭操作
            console.log('标签页关闭功能暂未实现');
        });
    });
    
    // 设置面板事件
    setupSettingsPanel();
    
    console.log('✅ 事件监听器设置完成');
}

// 处理地址栏搜索
function handleSearch() {
    const urlInput = document.getElementById('urlInput');
    if (!urlInput) return;
    
    const query = urlInput.value.trim();
    if (!query) return;
    
    console.log('🔍 地址栏搜索:', query);
    
    if (isUrl(query)) {
        loadUrl(query);
    } else {
        performSearch(query);
    }
}

// 处理主页搜索
function handleMainSearch() {
    const mainSearch = document.getElementById('mainSearch');
    if (!mainSearch) return;
    
    const query = mainSearch.value.trim();
    if (!query) return;
    
    console.log('🔍 主页搜索:', query);
    
    if (isUrl(query)) {
        loadUrl(query);
    } else {
        performSearch(query);
    }
}

// 执行搜索
function performSearch(query) {
    const engine = searchEngines[currentSearchEngine];
    if (engine) {
        const searchUrl = engine.searchUrl + encodeURIComponent(query);
        loadUrl(searchUrl);
        updateStatus('正在使用' + engine.name + '搜索: ' + query);
    }
}

// 检查是否为URL
function isUrl(text) {
    try {
        new URL(text.includes('://') ? text : 'http://' + text);
        return true;
    } catch {
        return false;
    }
}

// 格式化URL
function formatUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return 'https://' + url;
}

// 加载URL
function loadUrl(url) {
    console.log('🌐 加载URL:', url);
    
    const formattedUrl = formatUrl(url);
    const webview = document.getElementById('webview1');
    const startPage = document.querySelector('.start-page');
    
    if (webview && startPage) {
        // 隐藏起始页，显示webview
        startPage.style.display = 'none';
        webview.classList.remove('hidden');
        webview.src = formattedUrl;
        
        // 更新地址栏
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.value = formattedUrl;
        }
        
        // 更新状态
        updateStatus('正在加载: ' + formattedUrl);
        updateTabTitle('正在加载...');
        
        // 设置webview事件
        setupWebviewEvents(webview);
    }
}

// 设置webview事件
function setupWebviewEvents(webview) {
    // 页面开始加载
    webview.addEventListener('did-start-loading', function() {
        updateStatus('正在加载页面...');
        showProgress(true);
    });
    
    // 页面加载完成
    webview.addEventListener('did-stop-loading', function() {
        updateStatus('页面加载完成');
        showProgress(false);
        updateNavButtons();
    });
    
    // 页面标题更新
    webview.addEventListener('page-title-updated', function(e) {
        updateTabTitle(e.title || '新标签页');
    });
    
    // 页面导航
    webview.addEventListener('did-navigate', function(e) {
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.value = e.url;
        }
        updateNavButtons();
    });
    
    // 页面加载失败
    webview.addEventListener('did-fail-load', function(e) {
        if (e.errorCode !== -3) { // 忽略取消的请求
            updateStatus('页面加载失败: ' + e.errorDescription);
            showErrorPage();
        }
    });
}

// 导航webview
function navigateWebview(action) {
    const webview = document.getElementById('webview1');
    if (!webview) return;
    
    console.log('🧭 导航操作:', action);
    
    switch (action) {
        case 'back':
            if (webview.canGoBack()) {
                webview.goBack();
            }
            break;
        case 'forward':
            if (webview.canGoForward()) {
                webview.goForward();
            }
            break;
        case 'reload':
            webview.reload();
            break;
    }
    
    // 延迟更新按钮状态
    setTimeout(updateNavButtons, 100);
}

// 更新导航按钮状态
function updateNavButtons() {
    const webview = document.getElementById('webview1');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    
    if (webview && backBtn && forwardBtn) {
        backBtn.disabled = !webview.canGoBack();
        forwardBtn.disabled = !webview.canGoForward();
    }
}

// 回到主页
function goHome() {
    const engine = searchEngines[currentSearchEngine];
    if (engine) {
        loadUrl(engine.homepage);
    }
}

// 创建新标签页（简化版）
function createNewTab() {
    console.log('📂 创建新标签页功能开发中...');
    updateStatus('新标签页功能开发中...');
}

// 切换设置面板
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        settingsPanel.classList.toggle('show');
        console.log('⚙️ 切换设置面板');
    }
}

// 设置面板事件
function setupSettingsPanel() {
    // 关闭设置按钮
    const closeSettings = document.querySelector('.close-settings');
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            const settingsPanel = document.getElementById('settingsPanel');
            if (settingsPanel) {
                settingsPanel.classList.remove('show');
            }
        });
    }
    
    // 搜索引擎选择
    const searchEngineSelect = document.getElementById('searchEngine');
    if (searchEngineSelect) {
        // 填充选项
        searchEngineSelect.innerHTML = '';
        Object.keys(searchEngines).forEach(function(key) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = searchEngines[key].name;
            if (key === currentSearchEngine) {
                option.selected = true;
            }
            searchEngineSelect.appendChild(option);
        });
        
        // 监听变化
        searchEngineSelect.addEventListener('change', function() {
            currentSearchEngine = this.value;
            const engineName = searchEngines[currentSearchEngine].name;
            updateStatus('搜索引擎已切换为: ' + engineName);
            console.log('🔍 搜索引擎切换为:', engineName);
        });
    }
}

// 更新标签页标题
function updateTabTitle(title) {
    const tabTitle = document.querySelector('.tab-title');
    if (tabTitle) {
        tabTitle.textContent = title;
    }
}

// 更新状态
function updateStatus(message) {
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.textContent = message;
    }
    console.log('📊 状态:', message);
}

// 显示/隐藏进度
function showProgress(show) {
    const progressBar = document.getElementById('progressBar');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (progressBar) {
        progressBar.style.width = show ? '50%' : '0%';
    }
    
    if (loadingIndicator) {
        loadingIndicator.classList.toggle('hidden', !show);
    }
}

// 显示错误页面
function showErrorPage() {
    const webview = document.getElementById('webview1');
    const startPage = document.querySelector('.start-page');
    const searchResults = document.getElementById('searchResults');
    
    if (webview && startPage) {
        webview.classList.add('hidden');
        startPage.style.display = 'block';
        
        if (searchResults) {
            searchResults.innerHTML = `
                <div class="result-item">
                    <div class="result-title">🚫 页面加载失败</div>
                    <div class="result-description">无法连接到该网站，请检查网络连接或稍后重试。</div>
                    <div style="margin-top: 10px;">
                        <button onclick="navigateWebview('reload')" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">重新加载</button>
                    </div>
                </div>
            `;
        }
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl+T 新建标签页
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        createNewTab();
    }
    
    // Ctrl+R 刷新
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        navigateWebview('reload');
    }
    
    // F5 刷新
    if (e.key === 'F5') {
        e.preventDefault();
        navigateWebview('reload');
    }
});

// 阻止默认右键菜单
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('❌ 全局错误:', e.error);
    updateStatus('应用程序出现错误');
});

console.log('🎉 乐乐浏览器前端脚本加载完成！');
console.log('🔍 当前搜索引擎:', searchEngines[currentSearchEngine].name);