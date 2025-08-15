// 乐乐浏览器 - 使用真正webview版本
console.log('🚀 乐乐浏览器启动（webview版本）...');

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

let currentSearchEngine = 'google';

// 等待页面加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成');
    
    // 检查并修复webview
    fixWebview();
    
    // 设置事件监听器
    setupEvents();
    
    // 修复设置面板
    fixSettingsPanel();
    
    console.log('🎉 初始化完成！');
    updateStatus('乐乐浏览器已就绪 - 使用真正的webview');
});

// 修复webview
function fixWebview() {
    console.log('🔧 检查webview配置...');
    
    const webview = document.getElementById('webview1');
    if (webview) {
        console.log('✅ 找到原始webview');
        
        // 确保webview有正确的属性
        webview.setAttribute('allowpopups', '');
        webview.setAttribute('useragent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LeleBrowser/1.0.0');
        webview.setAttribute('webpreferences', 'contextIsolation=false, webSecurity=false');
        
        // 设置webview事件
        setupWebviewEvents(webview);
        
        console.log('✅ webview配置完成');
    } else {
        console.log('❌ 未找到webview，创建新的...');
        createNewWebview();
    }
}

// 创建新的webview
function createNewWebview() {
    const tabContent = document.querySelector('.tab-content.active');
    if (tabContent) {
        // 移除可能存在的iframe
        const existingFrame = document.getElementById('testFrame');
        if (existingFrame) {
            existingFrame.remove();
        }
        
        // 创建新的webview
        const webview = document.createElement('webview');
        webview.id = 'webview1';
        webview.className = 'webview hidden';
        webview.style.width = '100%';
        webview.style.height = '100%';
        webview.src = 'about:blank';
        webview.setAttribute('allowpopups', '');
        webview.setAttribute('useragent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LeleBrowser/1.0.0');
        webview.setAttribute('webpreferences', 'contextIsolation=false, webSecurity=false');
        
        tabContent.appendChild(webview);
        
        // 设置事件
        setupWebviewEvents(webview);
        
        console.log('✅ 新webview创建完成');
    }
}

// 设置webview事件
function setupWebviewEvents(webview) {
    console.log('⚙️ 设置webview事件...');
    
    webview.addEventListener('did-start-loading', function() {
        console.log('🔄 页面开始加载');
        updateStatus('正在加载页面...');
        showProgress(true);
    });
    
    webview.addEventListener('did-stop-loading', function() {
        console.log('✅ 页面加载完成');
        updateStatus('页面加载完成');
        showProgress(false);
        updateNavButtons();
    });
    
    webview.addEventListener('page-title-updated', function(e) {
        console.log('📄 页面标题更新:', e.title);
        updateTabTitle(e.title || '新标签页');
    });
    
    webview.addEventListener('did-navigate', function(e) {
        console.log('🧭 页面导航:', e.url);
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.value = e.url;
        }
        updateNavButtons();
    });
    
    webview.addEventListener('did-fail-load', function(e) {
        if (e.errorCode !== -3) { // 忽略取消的请求
            console.log('❌ 页面加载失败:', e.errorDescription);
            updateStatus('页面加载失败: ' + e.errorDescription);
            showErrorPage(e.errorDescription);
        }
    });
    
    webview.addEventListener('dom-ready', function() {
        console.log('🎯 DOM就绪');
        updateStatus('页面渲染完成');
    });
    
    // 处理新窗口
    webview.addEventListener('new-window', function(e) {
        console.log('🆕 新窗口请求:', e.url);
        e.preventDefault();
        loadUrl(e.url);
    });
    
    console.log('✅ webview事件设置完成');
}

// 修复设置面板
function fixSettingsPanel() {
    console.log('🔧 修复设置面板...');
    
    let settingsPanel = document.getElementById('settingsPanel');
    if (!settingsPanel) {
        createSettingsPanel();
        settingsPanel = document.getElementById('settingsPanel');
    }
    
    if (settingsPanel) {
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '0';
        settingsPanel.style.right = '-400px';
        settingsPanel.style.width = '400px';
        settingsPanel.style.height = '100vh';
        settingsPanel.style.backgroundColor = 'white';
        settingsPanel.style.boxShadow = '-4px 0 20px rgba(0,0,0,0.1)';
        settingsPanel.style.zIndex = '1000';
        settingsPanel.style.transition = 'right 0.3s ease';
        settingsPanel.style.overflowY = 'auto';
        
        setupSettingsPanelEvents();
        console.log('✅ 设置面板配置完成');
    }
}

// 创建设置面板
function createSettingsPanel() {
    const settingsHTML = `
        <div id="settingsPanel" class="settings-panel hidden">
            <div class="settings-header" style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 1.5rem; font-weight: 300;">乐乐浏览器设置</h2>
                <button class="close-settings" id="closeSettingsBtn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; border-radius: 4px;">×</button>
            </div>
            <div class="settings-content" style="padding: 20px;">
                <div class="setting-group" style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #333; font-size: 1.2rem;">搜索引擎</h3>
                    <div class="setting-item" style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">选择默认搜索引擎：</label>
                        <select id="searchEngineSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="google">Google</option>
                            <option value="baidu">百度</option>
                            <option value="bing">Bing</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                        </select>
                    </div>
                </div>
                
                <div class="setting-group" style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #333; font-size: 1.2rem;">快速测试</h3>
                    <div class="setting-item">
                        <p style="margin-bottom: 10px;">点击测试网站加载：</p>
                        <button onclick="testLoad('https://www.google.com')" style="margin: 2px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">Google</button>
                        <button onclick="testLoad('https://www.baidu.com')" style="margin: 2px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">百度</button>
                        <button onclick="testLoad('https://github.com')" style="margin: 2px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">GitHub</button>
                        <button onclick="testLoad('https://www.bing.com')" style="margin: 2px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">Bing</button>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3 style="margin-bottom: 15px; color: #333; font-size: 1.2rem;">关于</h3>
                    <div class="about-info" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                        <p style="margin-bottom: 10px;"><strong>乐乐浏览器</strong> v1.0.0</p>
                        <p style="margin-bottom: 5px;">基于 Electron 开发</p>
                        <p style="margin-bottom: 5px;">使用 webview 技术</p>
                        <p style="margin-bottom: 10px;">邮箱：support@lelemail.online</p>
                        <hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 0.9em; color: #666;">
                            现在使用真正的webview标签，应该能正常加载所有网站了！
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
    console.log('✅ 设置面板HTML已创建');
}

// 测试加载网站
function testLoad(url) {
    console.log('🧪 测试加载:', url);
    loadUrl(url);
    hideSettingsPanel();
}

// 设置面板事件
function setupSettingsPanelEvents() {
    const closeBtn = document.getElementById('closeSettingsBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSettingsPanel);
    }
    
    const searchEngineSelect = document.getElementById('searchEngineSelect');
    if (searchEngineSelect) {
        searchEngineSelect.value = currentSearchEngine;
        
        searchEngineSelect.addEventListener('change', function() {
            currentSearchEngine = this.value;
            const engineName = searchEngines[currentSearchEngine].name;
            console.log('🔍 搜索引擎切换为:', engineName);
            updateStatus('搜索引擎已切换为: ' + engineName);
        });
    }
}

// 显示/隐藏设置面板
function showSettingsPanel() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        console.log('⚙️ 显示设置面板');
        settingsPanel.classList.remove('hidden');
        settingsPanel.style.right = '0px';
        updateStatus('设置面板已打开');
    }
}

function hideSettingsPanel() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        console.log('❌ 隐藏设置面板');
        settingsPanel.style.right = '-400px';
        setTimeout(() => {
            settingsPanel.classList.add('hidden');
        }, 300);
        updateStatus('设置面板已关闭');
    }
}

function toggleSettingsPanel() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
        const isVisible = settingsPanel.style.right === '0px';
        if (isVisible) {
            hideSettingsPanel();
        } else {
            showSettingsPanel();
        }
    } else {
        createSettingsPanel();
        fixSettingsPanel();
        setTimeout(showSettingsPanel, 100);
    }
}

// 设置事件监听器
function setupEvents() {
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
    setupNavigationButtons();
    
    // 快速访问链接
    setupQuickLinks();
    
    // 设置按钮
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚙️ 设置按钮被点击！');
            toggleSettingsPanel();
        });
    }
    
    // 点击外部关闭设置面板
    document.addEventListener('click', function(e) {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (settingsPanel && settingsBtn) {
            const isClickInsidePanel = settingsPanel.contains(e.target);
            const isClickOnSettingsBtn = settingsBtn.contains(e.target);
            const isPanelVisible = settingsPanel.style.right === '0px';
            
            if (isPanelVisible && !isClickInsidePanel && !isClickOnSettingsBtn) {
                hideSettingsPanel();
            }
        }
    });
    
    console.log('✅ 所有事件监听器设置完成');
}

// 加载URL
function loadUrl(url) {
    console.log('🌐 加载URL:', url);
    
    const formattedUrl = formatUrl(url);
    const webview = document.getElementById('webview1');
    const startPage = document.querySelector('.start-page');
    
    if (webview && startPage) {
        try {
            // 隐藏起始页，显示webview
            startPage.style.display = 'none';
            webview.classList.remove('hidden');
            
            // 更新地址栏
            const urlInput = document.getElementById('urlInput');
            if (urlInput) {
                urlInput.value = formattedUrl;
            }
            
            // 加载页面
            webview.src = formattedUrl;
            
            updateStatus('正在加载: ' + formattedUrl);
            updateTabTitle('正在加载...');
            
            console.log('✅ 开始加载webview:', formattedUrl);
            
        } catch (error) {
            console.error('❌ 加载URL时出错:', error);
            updateStatus('加载失败: ' + error.message);
            showErrorPage('加载失败');
        }
    } else {
        console.log('❌ webview或startPage未找到');
        if (!webview) {
            console.log('重新创建webview...');
            createNewWebview();
            setTimeout(() => loadUrl(url), 1000);
        }
    }
}

// 导航webview
function navigateWebview(action) {
    const webview = document.getElementById('webview1');
    if (!webview) {
        console.log('❌ webview未找到');
        return;
    }
    
    console.log('🧭 导航操作:', action);
    
    switch (action) {
        case 'back':
            if (webview.canGoBack()) {
                webview.goBack();
                updateStatus('返回上一页');
            }
            break;
        case 'forward':
            if (webview.canGoForward()) {
                webview.goForward();
                updateStatus('前进到下一页');
            }
            break;
        case 'reload':
            webview.reload();
            updateStatus('正在刷新页面');
            break;
    }
    
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
        console.log('🔄 导航按钮状态已更新');
    }
}

// 设置导航按钮
function setupNavigationButtons() {
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const homeBtn = document.getElementById('homeBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => navigateWebview('back'));
    }
    
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => navigateWebview('forward'));
    }
    
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => navigateWebview('reload'));
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            const engine = searchEngines[currentSearchEngine];
            loadUrl(engine.homepage);
        });
    }
    
    console.log('✅ 导航按钮事件已设置');
}

// 设置快速访问链接
function setupQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-link');
    console.log('🔗 找到快速访问链接数量:', quickLinks.length);
    
    quickLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                console.log('🔗 快速访问链接被点击:', url);
                loadUrl(url);
            }
        });
    });
}

// 处理搜索
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

function performSearch(query) {
    const engine = searchEngines[currentSearchEngine];
    if (engine) {
        const searchUrl = engine.searchUrl + encodeURIComponent(query);
        console.log('🔍 执行搜索:', searchUrl);
        loadUrl(searchUrl);
    }
}

// 辅助函数
function isUrl(text) {
    const urlPattern = /^(https?:\/\/)|(www\.)/i;
    const domainPattern = /\.[a-z]{2,}$/i;
    return urlPattern.test(text) || domainPattern.test(text);
}

function formatUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return 'https://' + url;
}

function updateTabTitle(title) {
    const tabTitle = document.querySelector('.tab-title');
    if (tabTitle) {
        tabTitle.textContent = title || '新标签页';
    }
}

function updateStatus(message) {
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.textContent = message;
    }
    console.log('📊 状态更新:', message);
}

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

function showErrorPage(error) {
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
                    <div class="result-description">
                        错误信息: ${error}<br><br>
                        请检查网络连接或尝试其他网站。
                    </div>
                    <div style="margin-top: 15px;">
                        <button onclick="navigateWebview('reload')" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">重新加载</button>
                        <button onclick="loadUrl('https://www.google.com')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">访问Google</button>
                    </div>
                </div>
            `;
        }
    }
}

// 全局函数（供HTML按钮调用）
window.testLoad = testLoad;
window.loadUrl = loadUrl;
window.navigateWebview = navigateWebview;

console.log('🎉 乐乐浏览器webview版本加载完成！');