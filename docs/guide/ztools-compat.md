# ZTools 插件兼容

dida 的兼容运行时（`apiProfile: "compat"`）可以直接跑 ZTools 生态的插件：
清单是 `plugin.json`，页面用 `window.ztools`，安装包是 `.zpx`。

::: tip 官方文档已全文收录
ZTools 的 15 页官方文档已收录在站内 → [ZTools 文档分区](/ztools/)。
写插件时查清单字段、API 签名、发布流程，直接看那一套即可；本页只讲 **dida 与 ZTools 的差异**。
:::

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

**116 个 API 全部有实现**（口径：ZTools 官方 `plugin-api.md` 里出现的每一个 `ztools.xxx()`
函数签名，含分组方法）。覆盖情况由两条自动化测试守着 —— 一条核对顶层方法名，
一条直接读官方文档正文逐条比对，上游加 API 时会立刻报缺哪几个。

按保真度分三档：

| 档 | 含义 | 例子 |
|---|---|---|
| **等价** | 能力本来就一致 | `copyText`、`showOpenDialog`、`screenCapture`、`getThemeInfo`、`db.*` |
| **近似** | 用相近能力拼出来，常见场景无差别 | `hideMainWindowPasteText`（写剪贴板 + 合成 Ctrl+V）、`hideMainWindowTypeString`、`http.setHeaders` |
| **降级** | dida 没有对应能力，返回 `{ ok: false, reason }` | `simulateMouseClick`（未开放鼠标注入）、`runFFmpeg`（未内置 ffmpeg）、`ubrowser*`（无内置浏览器）、`hideMainWindowPasteFile`（不写 CF_HDROP，只粘路径文本） |

降级**不会静默失败**：插件里 `if (!result.ok)` 就能拿到中文原因，做自己的兜底。

### 剪贴板历史（`clipboard.*`）

ZTools 的 `clipboard` 组**不是**「写系统剪贴板」，而是它的剪贴板历史管理器。
dida 里两组并存：

| 你调用的 | 得到什么 |
|---|---|
| `clipboard.writeText` / `readText` / `writeImage` / `readImage` / `writeHTML` / `readHTML` / `readBuffer` / `writeBuffer` / `availableFormats` / `has` | 直接映射 Electron 剪贴板（dida 扩展，ZTools 没有这些） |
| `clipboard.getHistory(page, pageSize, filter)` | 历史分页，`{ items, total, page, pageSize }` |
| `clipboard.search(keyword)` | 在预览与正文里搜 |
| `clipboard.delete(id)` / `clipboard.clear(type)` | 删一条 / 清空（`clear` 同时清系统剪贴板） |
| `clipboard.write(id, shouldPaste)` / `clipboard.writeContent(data, shouldPaste)` | 写回剪贴板，默认同时合成粘贴 |
| `clipboard.getStatus()` / `clipboard.updateConfig({ enabled, maxItems, pollInterval })` | 状态与配置 |
| `clipboard.onChange(cb)` / `offChange()` | 新记录推送 |

实现上三个要知道的点：

- **惰性启动**。Electron 没有剪贴板变更事件，只能轮询（默认 800ms）。没有插件用到时
  完全不起定时器，订阅者归零 5 分钟后自动停 —— 不会为没人用的功能一直读剪贴板。
- **上限 200 条，落盘 `~/.dida/compat-clipboard.json`**。超过 8MB 的图片只存 320px 缩略图。
- **文件**：能识别系统剪贴板里的文件路径（Windows `FileNameW` / macOS `public.file-url`），
  但写不了文件剪贴板（CF_HDROP），`writeContent({ type: 'files' })` 会退化成写路径文本并返回 `success: false`。

### Provider（`providers.*`）

| API | dida 的实现 |
|---|---|
| `providers.getProviders(type)` | 内置 `dida-ai`（translation）+ 所有已装插件在清单里声明的 Provider |
| `providers.getDefaultProvider(type)` | 同上，取 `isDefault` 或第一个；没有则 `null` |
| `providers.invokeProvider(type, input, id)` | 内置的走主进程；插件自己注册的在**它自己的页面里**执行；跨插件调用明确拒绝并给出原因 |
| `registerProvider(key, handler)` | key 必须在 `plugin.json.providers` 里声明，否则抛 `Error`（与 ZTools 一致） |
| `translate(text, { from, to })` | 走内置 `dida-ai`：**用你「设置 → 模型」里的默认对话模型**，花你自己的额度；失败返回原文 |
| `ocr(image)` | 没有内置 OCR Provider，插件自己注册 ocr provider 才有结果，否则返回 `{ text: '' }` |

`registerTool(name, handler)` 同样做声明校验（名字不在 `plugin.json.tools` 里就抛错），
但 dida 没有 MCP 服务端，注册只是暂存 —— 工具不会被外部调到。

### HTTP 头（`http.*`）

`ztools.http(...)` 与 `http.setHeaders()` 是同一个对象（JS 里函数也是对象）：

```js
ztools.http.setHeaders({ Authorization: 'Bearer xxx' });
// 之后所有 ztools.http(...) 都会自动带上这个头
const res = await ztools.http('GET', 'https://api.example.com/me');
```

头按插件隔离持久化在 `~/.dida/compat-http-headers.json`，卸载时清掉。

**边界**：dida 只给 `ztools.http()` 这个通道注入头，不会改动插件自己 `fetch()` 发出的请求
（那需要包住页面的 fetch，副作用太大）。用原生 `fetch` 的插件请自己带上头。

### 完整分组清单

```
db.put / get / remove / bulkDocs / allDocs / findDocs
db.getAttachment / getAttachmentType / postAttachment
dbStorage.getItem / setItem / removeItem
clipboard.<上方表格>
http.setHeaders / getHeaders / clearHeaders
providers.getProviders / getDefaultProvider / invokeProvider / registerProvider
```


## 与 ZTools 的差异清单

| 能力 | ZTools | dida |
|---|---|---|
| 插件运行位置 | 呼出框内嵌 / 独立窗口 / 浮窗 | 呼出框 / 独立窗口 / **会话标签** |
| AI | `ztools.ai`（自带 AI 服务） | `window.dida.ai`（走你自己的模型配置）+ `ztools.aiChat` 兼容面 |
| 剪贴板历史 | 内置管理器 + 独立界面 | 管理器有（API 全支持），**没有历史浏览界面** |
| 翻译 Provider | 内置多家翻译服务 | 内置 `dida-ai`（走你的对话模型）；跨插件调用不支持 |
| OCR | 内置 OCR Provider | 无内置，需插件自己注册 |
| MCP 工具 | `registerTool` 后由 ZTools MCP 服务对外暴露 | 只做声明校验，不对外暴露（dida 无 MCP 服务端） |
| 内置浏览器 | `ubrowserLogin` 等 | 不支持（返回降级结果） |
| 鼠标注入 | `simulateMouseClick` | 不支持 |
| ffmpeg | `runFFmpeg` | 不支持（插件自带二进制可自行处理） |
| 文件剪贴板 | `copyFile` 写 CF_HDROP | 能读不能写，写成路径文本 |
| 市场 | 官方市场（账号体系） | 官方市场只读拉取；不需要登录 |

## uTools 插件

同一套兼容运行时也认 utools 的 `plugin.json` 与 `window.utools`，
差别只在事件名与少数组件 API —— dida 侧两个名字都挂在页面上。
