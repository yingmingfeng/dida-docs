# 宿主 API（window.dida）

插件页面通过 `window.dida` 与 dida 通信。桥接运行时页面**没有 Node 权限**，
所有能力都由宿主代劳；兼容运行时（utools / ZTools 插件）额外拿到 `window.utools` / `window.ztools`。

## 上下文与生命周期

```js
window.dida.context        // { plugin: {...}, launch: { featureCode, cmd, payload } }
window.dida.onPluginEnter((payload) => {})   // 从呼出框 / 超级面板进入
window.dida.onPluginReady((payload) => {})   // 页面就绪
window.dida.onPluginOut(() => {})            // 被关闭
```

## 宿主 AI

```js
const info = await window.dida.ai.info();
// { available: true, model: { id, displayName, provider, isDefault } }

const reply = await window.dida.ai.chat({
  system: '你是一个严谨的中文校对助手',
  messages: [{ role: 'user', content: '把这段话改得更专业' }],
  temperature: 0.3,
  maxTokens: 800,
  json: false,
});
// { ok: true, text: '...', modelDisplayName: '...' }

// 流式：传 onDelta，每段文本回调一次；返回值里 text 仍是完整结果
await window.dida.ai.chat({
  messages: [{ role: 'user', content: '写一段自我介绍' }],
  onDelta: (delta) => process.stdout?.write?.(delta) ?? console.log(delta),
});
```

约定：

- **不需要 API Key**：模型、端点、密钥全在 dida 侧，走你「设置 → 模型」里的默认模型；
- 失败不抛异常，返回 `{ ok: false, message }`，`message` 是可以直接给用户看的中文；
- `modelId` 可指定某条模型配置；`ai.listModels()` 列出可用的。

## 窗口与呼出框

```js
window.dida.setExpendHeight(680);          // 呼出框内嵌时撑高
window.dida.setSubInput((e) => {}, '搜索…'); // 呼出框二级输入框
window.dida.hideMainWindow();
window.dida.showMainWindow();
```

## 系统能力

```js
await window.dida.copyText('hello');        // clipboard.write
await window.dida.readClipboard();          // clipboard.read（需授权）
await window.dida.copyImage(dataUrl);
await window.dida.showNotification('装好了', '提示');
await window.dida.showOpenDialog({ properties: ['openFile'] });
await window.dida.showSaveDialog({ defaultPath: 'a.txt' });
await window.dida.shellOpenExternal('https://example.com');   // shell.open
await window.dida.shellOpenPath('/path/to/file');             // shell.open
await window.dida.getFileIcon('/path/to/exe');
window.dida.isWindows(); window.dida.isMacOs(); window.dida.isLinux();
window.dida.getPermissions();               // 当前已授予的权限
```

## 存储

同步接口（与 utools 语义一致）：

```js
window.dida.dbStorage.setItem('key', { any: 'json' });
window.dida.dbStorage.getItem('key');
window.dida.dbStorage.removeItem('key');

window.dida.db.put({ _id: 'doc-1', title: 'hi' });
window.dida.db.get('doc-1');
window.dida.db.allDocs();
```

落盘位置：`~/.dida/plugins/data/<插件名>/`，按插件隔离。

## 权限被拒时

```js
const result = await window.dida.shellOpenExternal(url);
if (result && result.denied) {
  console.warn(result.reason); // 「尚未授予「打开外部程序与链接」权限，请在插件详情页开启」
}
```
