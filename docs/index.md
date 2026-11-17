---
layout: home

hero:
  name: dida 开发者文档
  text: 从零写一个插件，或把一个现成应用搬进来
  tagline: 宿主 API、插件清单、会话标签内运行，以及与 ZTools 生态的兼容层
  actions:
    - theme: brand
      text: 5 分钟跑起来
      link: /guide/getting-started
    - theme: alt
      text: 我正在用 ZTools
      link: /guide/ztools-compat
    - theme: alt
      text: ZTools 官方文档（全 15 页）
      link: /ztools/

features:
  - title: 两种运行时
    details: 桥接运行时只给 window.dida，插件页面没有 Node 权限；兼容运行时面向 utools / ZTools 插件，保留它们原有的 preload 与本机能力。
  - title: 会话标签里跑
    details: 插件不只是一个弹窗 —— 可以开在会话的标签条里，与对话、图片、文档标签并列，切走保活、关掉回收。
  - title: 宿主能力直接可用
    details: AI（走你「设置 → 模型」里的默认模型）、剪贴板、通知、文件对话框、键值存储，全都由宿主托管。
  - title: ZTools 文档已全文收录
    details: 官方 15 页（清单配置、插件 API、AI 能力、发布流程）原样收进站内，写兼容插件时不用再开第二个站点。
