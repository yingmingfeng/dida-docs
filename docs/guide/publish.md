# 打包与分发

## 打包

插件目录打成压缩包即可：

```bash
# zip（通用）
zip -r my-plugin.zip my-plugin -x "*/node_modules/*"

# zpx（ZTools 同款：brotli 压缩的 asar，体积更小）
npx @electron/asar pack my-plugin my-plugin.asar
brotli -q 11 my-plugin.asar -o my-plugin.zpx
```

dida 两种都认（按文件头判断容器，改扩展名骗不过去）。

## 分发

- **本地/团队**：插件页「安装插件包」选文件；
- **自建市场**：填一个 `total-plugins.json`（数组，每项是一个插件清单）作为市场源；
- **ZTools 市场**：在设置里切到「ZTools 官方市场」，直接装官方市场的插件。

## 版本号与更新

清单里的 `version` 是更新判断依据：市场里的版本比本地新时，插件页会出现「可更新」。
开发期插件（从文件夹安装）点「刷新」即可重新读取清单，不用重装。

## 卸载

卸载会删掉插件目录与登记信息，`~/.dida/plugins/data/<插件名>/` 里的私有数据默认保留，
需要清干净时手动删该目录。
