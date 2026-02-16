# 构建 Android APK 指南

本指南帮助你将待办事项网页打包成可在手机上安装的 APK 文件。

## 前置要求

1. **Node.js**（已安装，用于运行 Capacitor）
2. **Android Studio**  
   - 下载：https://developer.android.com/studio  
   - 安装后打开，按提示安装 Android SDK

## 快速构建步骤

### 1. 同步 Web 资源

修改 `www/` 目录下的网页后，需要先同步到 Android 项目：

```bash
cd todo-app
npm run cap:sync
```

### 2. 打开 Android 项目

```bash
npm run cap:open:android
```

会启动 Android Studio 并打开 `android` 目录。

### 3. 构建 APK

在 Android Studio 中：

1. 菜单：**Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. 构建完成后，点击右下角 **locate** 可找到 APK 文件

APK 路径示例：
```
todo-app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. 安装到手机

- **方式 A**：用数据线连接手机，在 Android Studio 中点击 **Run** 运行到真机
- **方式 B**：将 `app-debug.apk` 复制到手机，在文件管理器中点击安装（需允许「未知来源」安装）

---

## 使用命令行构建（可选）

若已配置 Android SDK 环境变量，可在项目根目录执行：

```bash
cd todo-app/android
./gradlew assembleDebug
```

生成的 APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 发布到应用商店（可选）

若要发布到 Google Play，需构建**签名版本**：

1. 在 Android Studio 中：**Build** → **Generate Signed Bundle / APK**
2. 选择 **APK**，创建或选择密钥库
3. 构建完成后得到 `app-release.apk`

---

## 文件结构说明

```
todo-app/
├── www/                 # Web 资源（会被复制到 APK）
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── android/             # Android 原生项目
├── capacitor.config.json
└── package.json
```

修改网页时，编辑 `www/` 或根目录下的源文件后，运行 `npm run cap:sync` 再重新构建 APK。
