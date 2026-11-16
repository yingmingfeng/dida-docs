# plugin.json 配置

dida 读插件目录下 `package.json` 的普通字段 + 下列扩展字段。
（也从 `plugin.json` 读，用于兼容 utools / ZTools 插件。）

## 基础字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `name` | string | ✅ | 唯一标识，同时决定数据目录与协议 host |
| `pluginName` | string | ✅ | 展示名（兼容清单里是 `title`） |
| `description` | string | — | 一句话说明 |
| `version` | string | — | 版本号 |
| `author` | string | — | 作者 |
| `logo` | string | ✅ | `https:` / `data:` / 相对插件目录的路径 |
| `main` | string | ✅ | 入口 html |
| `pluginType` | `ui` \| `system` \| `app` | — | 缺省 `ui`；`app` 是本机程序快捷方式 |
| `category` | string | — | `finder` / `worker` / `tools` / `image` / `devPlugin` / `system` |
| `platform` | string[] | — | 限制平台，如 `["win32"]` |
| `spa` | boolean | — | 有前端路由就填 `true` |
| `height` | number | — | 呼出框内嵌时的期望高度 |
| `apiProfile` | `bridge` \| `compat` | — | 缺省 `bridge` |
| `preload` | string | — | 兼容运行时的插件 preload |
| `development` | string | — | 本地 dev server 地址 |

## 权限

`permissions` 声明需要的宿主能力：

| 权限 | 含义 | 默认授予 |
|---|---|---|
| `storage` | 插件私有键值存储 | ✅ |
| `notification` | 系统通知 | ✅ |
| `clipboard.write` | 写剪贴板 | ✅ |
| `ai.use` | 调用 dida 的模型（花你自己的额度） | ✅ |
| `clipboard.read` | 读剪贴板 | ❌ 用户勾选 |
| `shell.open` | 用默认程序打开链接/文件 | ❌ |
| `dialog.open` | 文件选择/保存对话框 | ❌ |
| `window.create` | 创建额外窗口 | ❌ |

未声明的权限一律拒绝；被拒时调用返回 `{ denied: true, reason }`。

## 功能命令（features）

```
features: [
  { code: 'hello', explain: '打个招呼', cmds: ['hello', '你好'] }
]
```

`cmds` 支持 6 种形态：

```json
[
  "完全匹配的文本",
  { "type": "regex", "label": "颜色", "match": "/^#([0-9a-f]{6})$/i", "minLength": 3 },
  { "type": "over", "label": "翻译", "minLength": 1, "maxLength": 10000, "exclude": ["/^\\//"] },
  { "type": "img", "label": "图片处理" },
  { "type": "files", "label": "批量改名", "fileType": "file", "extensions": ["txt", "md"] }
]
```

> `files` 与 `file` 等价：ZTools 清单写 `files`，dida 内部统一成 `file`，两种写法都认。

字段含义：

- `label`：在候选列表里显示的名字；
- `minLength` / `maxLength`：匹配长度上下限（`files` 下是文件个数）；
- `exclude`：排除正则，命中则这条命令不参与匹配；
- `fileType`：`file` / `directory` / `all`；
- `extensions`：扩展名列表（不带点，大小写不敏感）。

## 完整示例

```json
{
  "name": "resume-helper",
  "pluginName": "简历助手",
  "description": "AI 润色 + 错别字检查",
  "version": "1.2.0",
  "author": "you",
  "logo": "logo.svg",
  "main": "index.html",
  "spa": true,
  "pluginType": "ui",
  "category": "tools",
  "permissions": ["ai.use", "storage", "clipboard.write"],
  "features": [
    { "code": "open", "explain": "打开工作台", "cmds": ["简历", "resume"] }
  ]
}
```
