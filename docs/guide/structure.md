# 插件目录结构

## 最小结构

```
my-plugin/
├── package.json
├── index.html
└── logo.png
```

清单里 `main`、`logo` 是必需项；`preload` 只有兼容运行时才用得上。

## 带构建步骤（Vue / React / Svelte）

产物必须是普通 `html + css + js`：

```
my-plugin-src/        # 源码，自己留着
└── ...
my-plugin/            # 构建产物，才是插件目录
├── index.html
├── assets/*.js
├── assets/*.css
├── logo.png
└── package.json
```

**不要把源码目录整体当成插件**：`node_modules` 与源码文件会让插件包膨胀十倍以上。

## 单页应用（有前端路由）

前端路由的地址（`/app/xxx`）在磁盘上并不存在，用 `file://` 打开时一跳转就是白屏。
在清单里声明 `"spa": true`，dida 会用 `dida-plugin://<name>/` 提供入口，并把未命中的路径回退到入口 html：

```json
{
  "name": "my-spa",
  "main": "index.html",
  "spa": true
}
```

配套两条约定：

- 构建时 `base` 用 `/`（绝对资源路径会落在同一 host 下）；
- 页面里不要写死 `location.origin`，它是 `dida-plugin://<name>`。

## 数据目录

插件私有存储（`dida.dbStorage`）落在 `~/.dida/plugins/data/<插件名>/`，按插件隔离，卸载不代删。
