# 快速开始

一个 dida 插件就是一个**目录**：一份清单 + 一个入口页面。没有编译步骤也能跑。

## 1. 最小插件

```
my-plugin/
├── package.json     # 清单（dida 认这里的扩展字段）
├── index.html       # 入口页面
└── logo.svg
```

`package.json`：

```json
{
  "name": "my-plugin",
  "pluginName": "我的插件",
  "description": "一句话说明它能干什么",
  "version": "1.0.0",
  "author": "you",
  "logo": "logo.svg",
  "main": "index.html",
  "pluginType": "ui",
  "features": [
    { "code": "hello", "explain": "打个招呼", "cmds": ["hello", "你好"] }
  ]
}
```

## 2. 装上它

两种方式：

- **插件页 → 从文件夹安装**：选到 `my-plugin/` 目录即可（开发期推荐，改完点「刷新」生效）；
- **打包成 `.zip` / `.zpx` → 安装插件包**：分发给别人时用。

## 3. 在哪儿打开

| 位置 | 怎么进 |
|---|---|
| 呼出窗口 | 全局快捷键（默认 `Alt+Space`）→ 输入 `hello` |
| 独立窗口 | 呼出框里选「独立窗口打开」 |
| **会话标签** | 会话顶部标签条 `+` → 插件 → 我的插件 |

## 4. 用宿主能力

```html
<script>
  // 调 dida 的模型：不需要任何 API Key
  const reply = await window.dida.ai.chat({
    messages: [{ role: 'user', content: '用一句话介绍你自己' }],
  });
  console.log(reply.text);
</script>
```

## 下一步

- 想要前端框架 / 路由：[插件目录结构](/guide/structure)
- 想知道清单每个字段：[plugin.json 配置](/guide/plugin-json)
- 想接 AI、剪贴板、存储：[宿主 API](/guide/host-api)
