# Next.js 博客项目

这是一个基于 Next.js 15 构建的现代化博客项目，使用了最新的技术栈和最佳实践。项目已发布到 1.5 版本，采用 Markdown 文件管理系统，支持静态内容生成和分类管理。

## 🚀 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 现代化组件库
- **App Router** - Next.js 13+ 的新路由系统

## ✨ 核心特性

### 🎨 用户界面
- 🎨 现代化 UI 设计
- 📱 完全响应式布局
- 🌙 深色模式切换（支持系统偏好检测）
- ⚡ 快速开发和热重载
- 🔧 TypeScript 类型安全

### 📝 内容管理
- 📖 文章详情页面（动态路由）
- 📄 Markdown 文件管理系统
- 📁 分类文件夹组织（读书、生活、技术、收藏）
- 🔍 实时搜索功能
- 🏷️ 分类标签筛选（每个分类自动收集标签）
- ❤️ 文章收藏功能
- 💬 文章评论系统

### 👤 用户系统
- 🔐 用户注册和登录
- 👤 个人资料管理
- 📚 我的文章管理
- ❤️ 我的收藏管理
- 🛠️ 管理后台（管理员）

### 🎨 用户体验
- 🎨 现代化 UI 设计
- 📱 完全响应式布局
- 🌙 深色模式切换（支持系统偏好检测）
- ⚡ 快速开发和热重载
- 🔧 TypeScript 类型安全

### 🚀 性能优化
- 🎯 SEO 优化（动态元数据、Open Graph）
- 📡 RSS 订阅支持
- 📦 组件化架构
- ⚡ 静态导出优化

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看项目。

### 其他命令

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 📁 项目结构

```
nextjs-blog/
├── content/              # Markdown 文章目录
│   ├── reading/         # 读书分类
│   ├── life/            # 生活分类
│   ├── tech/            # 技术分类
│   └── collection/      # 收藏分类
├── src/
│   ├── app/             # App Router 页面
│   │   ├── about/       # 关于页面
│   │   ├── articles/    # 技术文章页面
│   │   │   └── [slug]/  # 文章详情页面
│   │   ├── reading/     # 读书页面
│   │   ├── life/        # 生活页面
│   │   ├── collection/  # 收藏页面
│   │   ├── feed.xml/    # RSS Feed API
│   │   ├── globals.css  # 全局样式
│   │   ├── layout.tsx   # 根布局
│   │   └── page.tsx     # 首页
│   ├── components/      # 可复用组件
│   │   ├── ui/         # shadcn/ui 组件
│   │   ├── Header.tsx  # 导航栏组件
│   │   ├── Footer.tsx  # 页脚组件
│   │   ├── ArticleList.tsx # 文章列表组件
│   │   └── ...          # 其他组件
│   └── lib/            # 工具函数和数据
│       ├── utils.ts    # 通用工具
│       ├── articles.ts # 文章数据管理
│       └── markdown.ts # Markdown 解析工具
├── public/             # 静态资源
├── components.json     # shadcn/ui 配置
├── next.config.ts     # Next.js 配置
├── tailwind.config.ts # Tailwind CSS 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

## 📝 添加文章

### Markdown 文件格式

在 `content/` 目录下的对应分类文件夹中创建 `.md` 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
slug: "article-slug"
date: "2024年1月20日"
category: "技术"  # 技术、读书、生活、收藏
tags: ["标签1", "标签2"]
author: "作者名"
featured: false
published: true
---

这里是文章内容，支持完整的 Markdown 语法...
```

### 文件组织

- `content/reading/` - 读书分类文章
- `content/life/` - 生活分类文章
- `content/tech/` - 技术分类文章
- `content/collection/` - 收藏分类文章

### Frontmatter 字段说明

- `title` (必填) - 文章标题
- `description` (必填) - 文章描述
- `slug` (必填) - URL 友好标识符
- `date` (必填) - 发布日期，格式："2024年1月20日"
- `category` (必填) - 文章分类：技术、读书、生活、收藏
- `tags` (可选) - 标签数组
- `author` (可选) - 作者名，默认："作者"
- `featured` (可选) - 是否为特色文章，默认：false
- `published` (可选) - 是否发布，默认：true

## 🎨 自定义主题

项目使用 Tailwind CSS 和 shadcn/ui 的主题系统。你可以在以下文件中自定义主题：

- `tailwind.config.ts` - Tailwind CSS 配置
- `src/app/globals.css` - 全局样式和 CSS 变量

## 📝 添加新页面

1. 在 `src/app/` 目录下创建新的文件夹
2. 在文件夹中创建 `page.tsx` 文件
3. 使用 App Router 的约定式路由

## 🔧 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用 TypeScript 和 React 最佳实践
3. 利用 shadcn/ui 组件作为基础

## 🚀 版本历史

### v1.5.0 (2025-11-22)
- 📄 Markdown 文件管理系统
- 📁 分类页面重构（读书、生活、技术、收藏）
- 🏷️ 分类标签自动收集和筛选
- 🗑️ 移除 Supabase 依赖，改用静态内容
- 📝 支持 Frontmatter 元数据管理

### v1.4.0 (2025-09-19)
- 🔐 Supabase 后端集成
- 💾 数据持久化存储
- 🔒 行级安全策略 (RLS)

### v1.3.0 (2025-09-13)
- 👤 用户认证系统
- ✏️ 文章编辑功能
- 🛠️ 管理后台

### v1.2.0 (2025-09-13)
- 🌙 深色模式切换功能
- 🏷️ 文章标签筛选功能
- ❤️ 文章收藏功能
- 💬 文章评论系统

### v1.1.0 (2025-09-13)
- 📖 文章详情页面（动态路由）
- 🔍 实时搜索功能
- 📡 RSS 订阅支持
- 🎯 SEO 优化

### v1.0.0 (2025-09-12)
- 🎉 初始版本发布
- 📱 响应式设计
- 🎨 现代化 UI

## 📦 部署

### EdgeOne Pages 部署

项目已成功部署到 EdgeOne Pages：

- **访问地址**: https://liao-blog-tzi5e0lgft.edgeone.run
- **控制台**: https://console.cloud.tencent.com/edgeone/pages/project/pages-gfanda1bgcmm/index

### Vercel 部署

也可以使用 [Vercel](https://vercel.com) 部署：

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### 其他平台

项目也可以部署到其他平台如 Netlify、Railway 等。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
