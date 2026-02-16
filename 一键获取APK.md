# 一键获取 APK（无需本地 Java/Android Studio）

通过 **GitHub Actions** 在云端自动构建 APK，你只需上传代码到 GitHub 即可获得安装包。

## 步骤（约 3 分钟）

### 1. 创建 GitHub 仓库（如已创建可跳过）

1. 打开 https://github.com/new  
2. 仓库名填 `20260216NoteAPK`  
3. 选择 **Public**  
4. 不要勾选 README（项目已有）  
5. 点击 **Create repository**

### 2. 推送代码

在 `todo-app` 目录下打开 PowerShell，从下面逐行复制命令执行（每行复制后粘贴到 PowerShell 回车）。

**注意：如果看到 \`\`\`powershell 或 \`\`\` 这样的符号，不要复制，那是文档格式。**

git config --global user.email "1961647257zzp@gmail.com"
git config --global user.name "YuqingZayn"
cd e:\20260216cursor_trying\todo-app
git init
git add .
git commit -m "待办事项应用"
git branch -M main
git remote remove origin
git remote add origin https://github.com/YuqingZayn/20260216NoteAPK.git
git push -u origin main

（若 push 时要求登录，选择浏览器登录或使用 Personal Access Token 作为密码）

### 3. 触发构建并下载 APK

1. 打开 https://github.com/YuqingZayn/20260216NoteAPK  
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
