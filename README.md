# 待办事项网页

基于 PRD 文档实现的轻量级待办事项管理应用。支持网页运行和打包成 Android APK。

## 快速运行

### 方式一：直接打开
双击 `index.html` 在浏览器中打开即可使用。

### 方式二：本地服务器（推荐）
若直接打开有兼容问题，可使用本地服务器：

```bash
# 在 todo-app 目录下
npx serve .

# 或使用 Python
python -m http.server 8080
```

然后访问 http://localhost:3000 或 http://localhost:8080

## 功能

- ✅ 添加待办（回车或点击 + 按钮）
- ✅ **优先级标注**（1 紧急 / 2 高 / 3 中 / 4 低，彩色显示，可点击徽章循环切换）
- ✅ 内联编辑（点击标题）
- ✅ 完成/未完成切换
- ✅ 删除单条待办
- ✅ 筛选：全部 / 未完成 / 已完成
- ✅ 排序：最新优先 / 最早优先
- ✅ 清空已完成
- ✅ 本地存储（LocalStorage），刷新不丢失
- ✅ 响应式布局，支持移动端

## 打包为 Android APK

需要构建可在手机上安装的 APK？请参阅 [BUILD-APK.md](BUILD-APK.md)。

简要步骤：
1. 安装 [Android Studio](https://developer.android.com/studio)
2. 运行 `npm run cap:sync` 和 `npm run cap:open:android`
3. 在 Android Studio 中 Build → Build APK(s)
4. 将生成的 APK 拷贝到手机安装

## 文件结构

```
todo-app/
├── index.html      # 页面结构（根目录，供浏览器直接打开）
├── styles.css
├── app.js
├── www/            # Capacitor 使用的 Web 资源（打包到 APK）
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── android/        # Android 原生项目
├── BUILD-APK.md    # APK 构建详细说明
└── README.md
```
