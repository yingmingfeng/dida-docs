# 把开源应用做成插件

把一个现成应用搬进 dida，工作量取决于它「形态」。先分类，再动手。

| 类别 | 特征 | 主要工作 |
|---|---|---|
| A 纯静态产物 | 已有 `dist/`，`index.html` + assets | 补清单即可 |
| B 纯前端 SPA | Vite/CRA，前端路由 | 协议 + `spa: true` + base |
| C SSR 全栈 | Next / Nuxt / Remix / TanStack Start | 关 SSR、摘服务端路由、写 shim |
| D 依赖后端 API | 前端只发 `/api/*` | 逐接口决定：接宿主 / 打桩 / 明确不支持 |
| E 需本机能力 | Electron/Tauri、跑命令 | 降级，或走 compat 运行时 |

## 核心手法：shim，而不是改源码

不要为了接 dida 去改上游源码 —— 上游一合并就冲突。推荐做法：
构建时往 `index.html` 的 `<head>` 里注入一段**内联脚本**，在应用 bundle 之前执行：

```js
const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href);
  if (!url.pathname.startsWith('/api/')) return originalFetch(input, init);

  if (url.pathname === '/api/polish') {
    // 原服务端的 AI 接口 → 宿主模型
    return streamFromDida(body);
  }
  if (url.pathname === '/api/models') {
    return new Response(JSON.stringify({ models: [] })); // 打桩
  }
  return new Response(JSON.stringify({ error: '插件版不支持' }), { status: 400 });
};
```

三条原则：

1. **只接管同源 `/api/*`**，其余透传；
2. 返回结构必须与原服务端一致，否则前端二次报错；
3. 「不支持」也要返回应用认识的结构，让它自己的错误提示把中文原因显示出来。

## 流式接口要注意

HTTP 状态只能在返回响应前定下来。先开流再失败，错误文案会被当成正文渲染进界面。
正确做法是**等首字再决定**：

```js
const outcome = await Promise.race([
  chat.then((r) => ({ kind: 'done', r })),
  firstDelta.then(() => ({ kind: 'first' })),
]);
if (outcome.kind === 'done' && outcome.r.ok === false) return errorJson(outcome.r.message);
return new Response(stream);
```

## 注入时机

若构建链是「先 SSR 渲染出 html 再落盘」（TanStack Start / Next 等），
Vite 的 `transformIndexHtml` **对这份 html 不生效**，要在构建脚本里等进程退出后改盘注入。

## 体积

`public/` 里常年躺着几百 MB 的字体原件、模板截图、landing 素材。
组装插件包时**边拷边过滤**（不是先全拷再删）：

- CSS 里被 `url()` 引用的才是资产，其余 `.ttf/.otf` 原件可以砍；
- 营销页图片、验证文件、`sitemap.xml` 都不是插件需要的。

## 验收清单

- [ ] 首屏无白屏、无 `ERR_FILE_NOT_FOUND`、无 `Failed to fetch`
- [ ] 有前端路由的用 `spa: true`，深层地址刷新不 404
- [ ] 接宿主的功能真的出结果；降级的功能点了有中文说明
- [ ] 上游 `src/` 零改动（`git status` 里只有新增的构建目录）
