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
      { text: '宿主 API', link: '/guide/host-api' },
      { text: 'ZTools 兼容', link: '/guide/ztools-compat' },
      { text: 'ZTools 文档', link: '/ztools/' },
    ],
    sidebar: {
      /**
       * 两套侧栏：dida 自己的指南，与全文收录的 ZTools 文档。
       *
       * 分成两个侧栏而不是塞进一个长列表：ZTools 那 15 页是**上游原文**，
       * 与 dida 段落混排会让人分不清「这句是 dida 的约定还是 ZTools 的」。
       * 靠路径前缀自动切换（/ztools/ 开头走后者），读者不会看到不相干的分组。
       */
      '/guide/': [
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
      '/ztools/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/ztools/getting-started' },
            { text: '插件应用目录结构', link: '/ztools/file-structure' },
            { text: '第一个插件', link: '/ztools/first-plugin' },
          ],
        },
        {
          text: '详细',
          items: [
            { text: 'plugin.json 配置', link: '/ztools/plugin-json' },
            { text: 'preload.js 配置', link: '/ztools/preload-js' },
            { text: 'Node.js 能力', link: '/ztools/node-js' },
            { text: '插件 API', link: '/ztools/plugin-api' },
            { text: '插件赞赏支付', link: '/ztools/plugin-payment' },
            { text: '开发者服务端 API', link: '/ztools/developer-server-api' },
            { text: 'Provider 开发指南', link: '/ztools/provider-development-guide' },
            { text: 'AI API', link: '/ztools/ai-api' },
            { text: 'AI 插件开发指南', link: '/ztools/ai-plugin-guide' },
            { text: '使用 Vibe Coding 快速开发', link: '/ztools/vibe-coding' },
          ],
        },
        {
          text: '发布',
          items: [
            { text: '发布与协作流程', link: '/ztools/publish-and-update' },
          ],
        },
        {
          text: '回到 dida',
          items: [
            { text: 'ZTools 兼容说明', link: '/guide/ztools-compat' },
            { text: '宿主 API（window.dida）', link: '/guide/host-api' },
          ],
        },
      ],
    },
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
