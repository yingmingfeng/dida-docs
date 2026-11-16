import { defineConfig } from 'vitepress';

/**
 * dida 开发者文档站。
 *
 * 形态对齐 ZTools 文档站（VitePress + 顶部导航 + 侧栏分组）：
 * 那套结构对「宿主 API + 插件清单」这类参考型内容最好用 —— 左栏找概念、
 * 右栏看目录、正文全是可复制的示例。
 *
 * base 与 GitHub Pages 的项目路径一致；换成自定义域名时只改这一行。
 */
export default defineConfig({
  lang: 'zh-CN',
  title: 'dida 开发者文档',
  description: 'dida 插件开发、宿主 API 与 ZTools 兼容说明',
  base: '/dida-docs/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '插件清单', link: '/guide/plugin-json' },
      { text: '宿主 API', link: '/guide/host-api' },
      { text: 'ZTools 兼容', link: '/guide/ztools-compat' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '插件目录结构', link: '/guide/structure' },
        ],
      },
      {
        text: '开发',
        items: [
          { text: 'plugin.json 配置', link: '/guide/plugin-json' },
          { text: '宿主 API（window.dida）', link: '/guide/host-api' },
          { text: '会话标签里运行插件', link: '/guide/tab-host' },
          { text: '把开源应用做成插件', link: '/guide/port-an-app' },
        ],
      },
      {
        text: '兼容与发布',
        items: [
          { text: 'ZTools 插件兼容', link: '/guide/ztools-compat' },
          { text: '测试与调试', link: '/guide/testing' },
          { text: '打包与分发', link: '/guide/publish' },
        ],
      },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    lastUpdatedText: '最后更新',
    socialLinks: [{ icon: 'github', link: 'https://github.com/yingmingfeng/dida' }],
    footer: {
      message: '文档按 MIT 许可发布，示例代码可自由取用',
      copyright: 'dida',
    },
  },
});
