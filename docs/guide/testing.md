# 测试与调试

## 打开开发者工具

插件页右键 → 检查，或在插件页详情里点「开发者工具」。标签内运行的插件同样适用。

## 自动化测试（Playwright）

插件页是普通 Web 内容，用 Playwright 打开即可；难的是**伪造宿主**。
推荐做法：把 `window.dida`（或 `window.ztools`）用一段脚本注入到 `<head>`，
再由静态服务返回插件目录：

```ts
const { server, url } = await servePlugin(PLUGIN_DIR); // 自带 SPA 回退 + 宿主桩
await page.goto(url, { waitUntil: 'networkidle' });
await expect(page.locator('#app')).toContainText('我的插件');
```

为什么由服务注入、而不是 `addInitScript`：实测后者在部分场景晚于页内内联脚本执行，
插件一进来就读 `window.ztools` 时会拿到 undefined，测试会假失败。

## 契约测试

比「跑通某个插件的某条路径」更稳的是**直接核对 API 面**：
把 ZTools 官方 preload 的方法名清单固化成一份 fixture，
再用正则核对 dida 的兼容 preload 是否都实现了。

```ts
const missing = ZTOOLS_API.filter(
  (name) => !new RegExp(`\\b${name}\\b`).test(didaPreloadSource),
);
expect(missing).toEqual([]);
```

ZTools 升级加了新 API 时，这条测试会立刻告诉你缺哪几个。
