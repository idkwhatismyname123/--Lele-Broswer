const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 搜索相关
  searchDuckDuckGo: (query) => ipcRenderer.invoke('search-duckduckgo', query),
  
  // 应用信息
  getAppInfo: () => {
    return {
      name: '乐乐浏览器',
      version: '1.0.0',
      platform: process.platform
    };
  },
  
  // 窗口控制事件监听
  onNewTab: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('new-tab', subscription);
    
    // 返回取消订阅函数
    return () => {
      ipcRenderer.removeListener('new-tab', subscription);
    };
  },
  
  onCloseTab: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('close-tab', subscription);
    
    return () => {
      ipcRenderer.removeListener('close-tab', subscription);
    };
  },
  
  onNavigate: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('navigate', subscription);
    
    return () => {
      ipcRenderer.removeListener('navigate', subscription);
    };
  },
  
  // 实用工具函数
  isUrl: (text) => {
    try {
      const url = new URL(text.includes('://') ? text : 'http://' + text);
      return ['http:', 'https:', 'file:', 'ftp:'].includes(url.protocol);
    } catch {
      return false;
    }
  },
  
  // 格式化URL
  formatUrl: (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://' + url;
  },
  
  // 获取域名
  getDomain: (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  },
  
  // 日志函数（开发用）
  log: (message, level = 'info') => {
    console.log(`[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`);
  },
  
  // 错误处理
  handleError: (error, context = 'Unknown') => {
    console.error(`[ERROR] ${context}:`, error);
    return {
      success: false,
      error: error.message || '未知错误',
      context
    };
  }
});

// 页面加载完成后的初始化
window.addEventListener('DOMContentLoaded', () => {
  // 设置应用信息
  const appInfo = {
    name: '乐乐浏览器',
    version: '1.0.0',
    platform: process.platform,
    loadTime: Date.now()
  };
  
  // 将应用信息存储到window对象
  window.appInfo = appInfo;
  
  // 添加键盘快捷键支持
  document.addEventListener('keydown', (event) => {
    // Ctrl+T 新建标签页
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
      event.preventDefault();
      // 通知主进程创建新标签页
      ipcRenderer.send('new-tab');
    }
    
    // Ctrl+W 关闭标签页
    if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
      event.preventDefault();
      ipcRenderer.send('close-tab');
    }
    
    // Ctrl+R 刷新页面
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      window.location.reload();
    }
    
    // F12 开发者工具
    if (event.key === 'F12') {
      event.preventDefault();
      ipcRenderer.send('toggle-devtools');
    }
  });
  
  // 添加右键菜单防护
  document.addEventListener('contextmenu', (event) => {
    // 允许在开发环境下使用右键菜单
    if (process.env.NODE_ENV !== 'development') {
      event.preventDefault();
    }
  });
  
  // 阻止默认的拖拽行为
  document.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
  
  document.addEventListener('drop', (event) => {
    event.preventDefault();
  });
  
  // 控制台欢迎信息
  console.log(`
  🎉 欢迎使用乐乐浏览器！
  📱 版本: ${appInfo.version}
  💻 平台: ${appInfo.platform}
  🕒 加载时间: ${new Date().toLocaleString()}
  
  开发者提示：
  - 按 Ctrl+T 新建标签页
  - 按 Ctrl+W 关闭标签页  
  - 按 F12 打开开发者工具
  `);
});