---
layout: home

hero:
  name: ZTools 文档（收录）
  text: 一个强大、可扩展的插件系统。
  tagline: 全文收录 ZTools 官方文档，dida 的兼容运行时按这套约定实现插件。
  actions:
    - theme: brand
      text: 从快速开始读
      link: /ztools/getting-started
    - theme: alt
      text: 插件 API 全集
      link: /ztools/plugin-api
    - theme: alt
      text: dida 兼容差异
      link: /guide/ztools-compat

features:
  - title: 简单配置
    details: 通过标准的 plugin.json 文件轻松定义插件。无需复杂的设置。
  - title: 丰富的 API
    details: 通过全局 ztools 对象访问系统能力，包括通知、模拟输入和持久化存储。
  - title: 灵活的指令
    details: 使用文本、正则或全局钩子触发您的插件，以适应任何工作流。
  - title: 跨平台
    details: 一次构建，在 Windows、macOS 和 Linux 上运行。在所有设备上获得一致的体验。
---

## 这一分区是什么

dida 的**兼容运行时**（清单里 `apiProfile: "compat"`）直接执行 ZTools 的插件约定：
`plugin.json` 清单、`preload.js`、`window.ztools` API 面、`.zpx` 安装包格式，都与 ZTools 一致。

因此 ZTools 的官方文档对 dida 插件开发者**同样适用** —— 这一分区把官方文档全文收录在站内，
方便你写插件时不必在两个站点之间跳转。

> **来源与版权**：以下各页内容来自 [ZTools 官方文档](https://ztoolscenter.github.io/ZTools-doc/)
> （[源码仓库](https://github.com/ZToolsCenter/ZTools-doc)），版权归 ZTools 团队所有。
> 本站收录仅用于 dida 的兼容实现参考，内容未作改写；dida 侧的差异在
> [ZTools 兼容说明](/guide/ztools-compat) 里单独列明。

## 读之前先知道三件事

**1. 完全照抄，但落点不同。** ZTools 文档里所有 `ztools.xxx()` 调用，在 dida 的插件页里都是
`window.ztools.xxx()`；dida 额外提供一个 `window.dida` 宿主面（AI、存储、权限控制），两者并存。

**2. 调用不出错，但少数能力是降级的。** 判定方式统一：看返回值。

```js
const result = await ztools.simulateMouseClick(100, 200);
if (result && result.ok === false) {
  // dida 未开放鼠标注入，result.reason 是中文说明
  ztools.showNotification('当前环境不支持鼠标注入');
}
```

116 个 API 全部有实现（含 `clipboard.getHistory` 这类历史管理、`providers.*` 翻译调用、
`http.setHeaders` 默认头），只有下面这些是真降级 —— 都以 `{ ok: false, reason }` 表达：

`simulateMouseClick`（鼠标注入）、`runFFmpeg`（未内置 ffmpeg）、`ubrowser*`（无内置浏览器）、
文件剪贴板写入（只写路径文本）、`registerTool` 的 MCP 暴露（只校验不对外）。

完整的逐条保真度见 [ZTools 兼容说明](/guide/ztools-compat#window-ztools-覆盖情况)。

**3. 装插件不用去 ZTools。** dida 设置 → 插件 → 市场来源选「ZTools 官方市场」，
市场页直接列官方插件，点安装即下载 `.zpx` 解包登记。
离线安装：把 `.zpx` 拖进插件页，或菜单「安装插件包」。

## 15 页怎么读

| 你在做什么 | 读哪几页 |
|---|---|
| 第一次写插件 | [快速开始](/ztools/getting-started) → [目录结构](/ztools/file-structure) → [第一个插件](/ztools/first-plugin) |
| 查某个 API 怎么用 | [插件 API](/ztools/plugin-api)（全量方法签名） |
| 配清单字段 | [plugin.json 配置](/ztools/plugin-json) |
| 要本机能力 | [Node.js 能力](/ztools/node-js) + [preload.js 配置](/ztools/preload-js) |
| 接 AI | [AI API](/ztools/ai-api) + [AI 插件开发指南](/ztools/ai-plugin-guide) |
| 做 Provider | [Provider 开发指南](/ztools/provider-development-guide) |
| 要收费 | [插件赞赏支付](/ztools/plugin-payment) |
| 接自己的后端 | [开发者服务端 API](/ztools/developer-server-api) |
| 发布给用户 | [发布与协作流程](/ztools/publish-and-update) |
