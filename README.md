# Next.js 博客项目

这是一个基于 Next.js 14+ 构建的现代化博客项目，使用了最新的技术栈和最佳实践。

## 🚀 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 现代化组件库
- **App Router** - Next.js 13+ 的新路由系统

## ✨ 特性

- 🎨 现代化 UI 设计
- 📱 完全响应式布局
- 🌙 深色模式支持
- ⚡ 快速开发和热重载
- 🔧 TypeScript 类型安全
- 🎯 SEO 优化
- 📦 组件化架构

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
├── src/
│   ├── app/                 # App Router 页面
│   │   ├── about/          # 关于页面
│   │   ├── articles/       # 文章列表页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # 可复用组件
│   │   ├── ui/            # shadcn/ui 组件
│   │   ├── Header.tsx     # 导航栏组件
│   │   └── Footer.tsx     # 页脚组件
│   └── lib/               # 工具函数
│       └── utils.ts       # 通用工具
├── public/                # 静态资源
├── components.json        # shadcn/ui 配置
├── tailwind.config.ts    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

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

## 📦 部署

### Vercel 部署

最简单的部署方式是使用 [Vercel](https://vercel.com)：

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### 其他平台

项目也可以部署到其他平台如 Netlify、Railway 等。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
