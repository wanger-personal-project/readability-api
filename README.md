# Readability API

基于 [@mozilla/readability](https://github.com/mozilla/readability) 的网页内容提取 API，部署在 Vercel Serverless Functions 上。

## 功能

- 输入任意网页 URL，返回提取的正文内容（Markdown 格式）
- 自动提取标题、作者、摘要等元信息
- 简洁的 URL 调用方式

## API 使用

### 请求

**简洁方式（推荐）：**

```
https://your-project.vercel.app/https://example.com/article
```


### 响应

**成功响应 (200)：**

```json
{
  "success": true,
  "data": {
    "title": "文章标题",
    "byline": "作者",
    "excerpt": "文章摘要",
    "siteName": "网站名称",
    "markdown": "# 文章内容\n\n正文...",
    "length": 12345
  }
}
```

**错误响应：**

```json
{
  "success": false,
  "error": "错误描述"
}
```

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误（缺少 url 或 url 格式无效） |
| 405 | 方法不允许（仅支持 GET） |
| 422 | 无法提取内容（页面没有可识别的正文） |
| 502 | 目标 URL 请求失败 |
| 500 | 服务器内部错误 |

---

## 部署教程

### 前置条件

1. [Node.js](https://nodejs.org/) 18+
2. [Vercel 账号](https://vercel.com/signup)（可用 GitHub 登录）
3. Vercel CLI（可选，用于本地开发和命令行部署）

### 方式一：通过 Vercel Dashboard 部署（推荐新手）

1. **Fork 或上传代码到 GitHub**

   ```bash
   cd /Users/wanger/Desktop/readability-api
   git init
   git add .
   git commit -m "Initial commit"

   # 在 GitHub 创建仓库后
   git remote add origin https://github.com/YOUR_USERNAME/readability-api.git
   git push -u origin main
   ```

2. **连接 Vercel**

   - 访问 [vercel.com/new](https://vercel.com/new)
   - 选择 "Import Git Repository"
   - 选择你的 `readability-api` 仓库
   - 点击 "Deploy"

3. **完成**

   部署成功后，你会得到一个 URL，例如：
   ```
   https://readability-api-xxx.vercel.app
   ```

   直接访问：
   ```
   https://readability-api-xxx.vercel.app/https://example.com/article
   ```

### 方式二：通过 Vercel CLI 部署

1. **安装依赖**

   ```bash
   cd /Users/wanger/Desktop/readability-api
   npm install
   ```

2. **安装 Vercel CLI（如果没有）**

   ```bash
   npm install -g vercel
   ```

3. **登录 Vercel**

   ```bash
   vercel login
   ```

   按提示完成邮箱验证或 GitHub 授权。

4. **本地开发测试（可选）**

   ```bash
   npm run dev
   # 或
   vercel dev
   ```

   本地服务启动后访问：
   ```
   http://localhost:3000/https://example.com
   ```

5. **部署到 Preview 环境**

   ```bash
   npm run deploy
   # 或
   vercel
   ```

   首次部署会询问项目配置，按回车使用默认值即可。

6. **部署到 Production 环境**

   ```bash
   npm run deploy:prod
   # 或
   vercel --prod
   ```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 测试 API
curl "http://localhost:3000/https://example.com"
```

---

## 免费层限制

Vercel Hobby（免费）计划限制：

| 资源 | 限制 |
|------|------|
| 函数调用 | 100,000 次/月 |
| 带宽 | 100 GB/月 |
| 执行超时 | 10 秒 |
| 内存 | 1024 MB |

对于个人使用完全足够。

---

## 技术栈

- **运行时**：Node.js 20
- **HTML 解析**：[jsdom](https://github.com/jsdom/jsdom)
- **内容提取**：[@mozilla/readability](https://github.com/mozilla/readability)
- **Markdown 转换**：[turndown](https://github.com/mixmark-io/turndown)
- **部署平台**：[Vercel Serverless Functions](https://vercel.com/docs/functions)

---

## License

MIT
