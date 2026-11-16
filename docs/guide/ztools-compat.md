# ZTools 插件兼容

dida 的兼容运行时（`apiProfile: "compat"`）可以直接跑 ZTools 生态的插件：
清单是 `plugin.json`，页面用 `window.ztools`，安装包是 `.zpx`。

## 怎么装

1. 插件页 → **设置 → 市场来源 → ZTools 官方市场**；
2. 市场页会列出 ZTools 官方市场的插件；
3. 点安装：dida 解析下载地址 → 下载 `.zpx` → 解包 → 登记为兼容插件。

也可以离线安装：把 `.zpx` 文件拖进插件页，或菜单里选「安装插件包」。

## .zpx 是什么

`.zpx` 是 **brotli（历史版本 gzip）压缩的 asar 归档**，里面是插件目录：

```
plugin.json      # 清单（权威配置）
preload.cjs      # 插件自带 preload，以本机权限运行
index.html       # 入口
assets/…         # 构建产物
logo.png
```

dida 解包时会先按 magic 判断容器（gzip / zip / brotli），再按 asar 头解析出文件，
最后落到 `~/.dida/plugins/packages/<name>/`。

> **安全边界**：兼容运行时的插件 preload 有本机权限（能读盘、能跑命令）。
> 安装时请只装你信任来源的插件 —— 这与 ZTools 自身的模型一致。

## window.ztools 覆盖情况

dida 的兼容 preload 复刻了 ZTools 3.2.0 `resources/preload.js` 暴露的全部 API，分三档保真度：

| 档 | 含义 | 例子 |
|---|---|---|
| **等价** | 能力本来就一致 | `copyText`、`showOpenDialog`、`screenCapture`、`getThemeInfo`、`db.*` |
| **近似** | 用相近能力拼出来，常见场景无差别 | `hideMainWindowPasteText`（写剪贴板 + 合成 Ctrl+V）、`hideMainWindowTypeString` |
| **降级** | dida 没有对应能力，返回 `{ ok: false, reason }` | `simulateMouseClick`（未开放鼠标注入）、`runFFmpeg`（未内置 ffmpeg）、`ubrowser*`（无内置浏览器）、`hideMainWindowPasteFile`（不写 CF_HDROP，只粘路径文本） |

降级**不会静默失败**：插件里 `if (!result.ok)` 就能拿到中文原因，做自己的兜底。

### 分组 API

```
db.put / get / remove / bulkDocs / allDocs / findDocs
db.getAttachment / getAttachmentType / postAttachment
dbStorage.getItem / setItem / removeItem
clipboard.write / writeContent / clear / delete / getHistory / getStatus / search / updateConfig / onChange
http.setHeaders / getHeaders / clearHeaders
providers.registerProvider / getProviders / getDefaultProvider / invokeProvider
```

## 与 ZTools 的差异清单

| 能力 | ZTools | dida |
|---|---|---|
| 插件运行位置 | 呼出框内嵌 / 独立窗口 / 浮窗 | 呼出框 / 独立窗口 / **会话标签** |
| AI | `ztools.ai`（自带 AI 服务） | `window.dida.ai`（走你自己的模型配置）+ `ztools.aiChat` 兼容面 |
| 内置浏览器 | `ubrowserLogin` 等 | 不支持（返回降级结果） |
| 鼠标注入 | `simulateMouseClick` | 不支持 |
| ffmpeg | `runFFmpeg` | 不支持（插件自带二进制可自行处理） |
| 市场 | 官方市场（账号体系） | 官方市场只读拉取；不需要登录 |

## uTools 插件

同一套兼容运行时也认 utools 的 `plugin.json` 与 `window.utools`，
差别只在事件名与少数组件 API —— dida 侧两个名字都挂在页面上。
