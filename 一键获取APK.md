# 一键获取 APK（无需本地 Java/Android Studio）

通过 **GitHub Actions** 在云端自动构建 APK，你只需上传代码到 GitHub 即可获得安装包。

## 步骤（约 3 分钟）

### 1. 创建 GitHub 仓库

1. 打开 https://github.com/new  
2. 仓库名可填 `todo-app`  
3. 选择 **Public**  
4. 不要勾选 README（项目已有）  
5. 点击 **Create repository**

### 2. 推送代码

在 `todo-app` 目录下打开终端，依次执行（**不要复制 \`\`\`bash**，只复制下面的命令）：

**首次使用 Git 需先配置（只需一次）：**
```
git config --global user.email "你的邮箱@example.com"
git config --global user.name "你的名字"
```

**推送代码：**
```
git init
git add .
git commit -m "待办事项应用"
git branch -M main
git remote remove origin
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

（将 `你的用户名` 和 `你的仓库名` 替换为实际的 GitHub 用户名和仓库名）

### 3. 触发构建并下载 APK

1. 进入你的 GitHub 仓库页面  
2. 点击上方 **Actions**  
3. 左侧选择 **构建 APK**  
4. 点击右侧 **Run workflow** → **Run workflow**  
5. 等待约 2–3 分钟，状态变为绿色 ✓  
6. 点击该次运行  
7. 在 **Artifacts** 处下载 **待办事项-debug.apk**

### 4. 安装到手机

将 `待办事项-debug.apk` 传到手机，在文件管理器中点击安装（需允许「未知来源」应用安装）。

---

## 提示

- 修改 `www/` 或根目录的网页后，运行 `npm run cap:sync`，再 push 到 GitHub，重新 Run workflow 即可生成新 APK  
- 若推送时自动运行了构建，可直接到 Actions 中查看并下载 APK
