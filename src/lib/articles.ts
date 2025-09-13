export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  slug: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "Next.js 15 新特性详解",
    description: "深入了解 Next.js 15 带来的新功能和改进，包括 App Router 的优化和性能提升。",
    content: `# Next.js 15 新特性详解

Next.js 15 带来了许多令人兴奋的新特性和改进，让我们深入了解这些变化如何影响我们的开发体验。

## 主要新特性

### 1. 改进的 App Router
App Router 在 Next.js 15 中得到了显著优化，提供了更好的性能和开发体验。

\`\`\`tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到 Next.js 15</h1>
    </div>
  );
}
\`\`\`

### 2. 增强的性能优化
- 更快的构建时间
- 改进的代码分割
- 优化的图片加载

### 3. 更好的 TypeScript 支持
Next.js 15 提供了更完善的 TypeScript 集成，包括更好的类型推断和错误提示。

## 迁移指南

如果你正在从 Next.js 14 升级到 15，请参考以下步骤：

1. 更新依赖版本
2. 检查破坏性变更
3. 测试应用功能
4. 优化性能配置

## 总结

Next.js 15 是一个重要的版本更新，带来了许多实用的新特性。建议开发者及时升级以获得更好的开发体验。`,
    date: "2024年1月15日",
    readTime: "8分钟阅读",
    category: "Next.js",
    tags: ["Next.js", "React", "前端框架", "性能优化"],
    author: "技术团队",
    slug: "nextjs-15-new-features",
    featured: true
  },
  {
    id: 2,
    title: "TypeScript 最佳实践指南",
    description: "学习如何在 React 和 Next.js 项目中有效使用 TypeScript，提高代码质量和开发效率。",
    content: `# TypeScript 最佳实践指南

TypeScript 是现代前端开发中不可或缺的工具，它提供了类型安全和更好的开发体验。

## 基础类型定义

### 接口设计
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}
\`\`\`

### 泛型使用
\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  // API 调用逻辑
};
\`\`\`

## React 中的 TypeScript

### 组件类型定义
\`\`\`tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
\`\`\`

## 最佳实践

1. **严格模式**：启用所有严格类型检查选项
2. **类型推断**：充分利用 TypeScript 的类型推断能力
3. **接口优先**：优先使用接口而不是类型别名
4. **避免 any**：尽量避免使用 any 类型

## 总结

TypeScript 的学习曲线可能较陡，但一旦掌握，它将大大提高代码质量和开发效率。`,
    date: "2024年1月12日",
    readTime: "12分钟阅读",
    category: "TypeScript",
    tags: ["TypeScript", "React", "类型安全", "最佳实践"],
    author: "技术团队",
    slug: "typescript-best-practices"
  },
  {
    id: 3,
    title: "Tailwind CSS 高级技巧",
    description: "掌握 Tailwind CSS 的高级用法，包括自定义主题、响应式设计和组件化开发。",
    content: `# Tailwind CSS 高级技巧

Tailwind CSS 不仅仅是一个 CSS 框架，它是一套完整的设计系统。

## 自定义主题

### 配置颜色
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
\`\`\`

### 自定义组件
\`\`\`css
@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors;
  }
}
\`\`\`

## 响应式设计

### 断点使用
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 响应式网格 -->
</div>
\`\`\`

### 移动优先
\`\`\`html
<div class="text-sm md:text-base lg:text-lg">
  <!-- 移动优先的字体大小 -->
</div>
\`\`\`

## 实用技巧

1. **使用 @apply**：将常用样式组合成组件类
2. **JIT 模式**：利用 Just-in-Time 编译的优势
3. **插件系统**：扩展 Tailwind 的功能
4. **性能优化**：合理使用 purge 选项

## 总结

掌握这些高级技巧将帮助你更好地使用 Tailwind CSS 构建现代化的用户界面。`,
    date: "2024年1月10日",
    readTime: "6分钟阅读",
    category: "CSS",
    tags: ["Tailwind CSS", "CSS", "响应式设计", "组件化"],
    author: "技术团队",
    slug: "tailwind-css-advanced-tips"
  },
  {
    id: 4,
    title: "shadcn/ui 组件库使用指南",
    description: "如何使用 shadcn/ui 快速构建美观的用户界面，提高开发效率。",
    content: `# shadcn/ui 组件库使用指南

shadcn/ui 是一个基于 Radix UI 和 Tailwind CSS 的组件库，提供了高质量的可访问组件。

## 安装和配置

### 初始化项目
\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

### 添加组件
\`\`\`bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
\`\`\`

## 组件使用

### Button 组件
\`\`\`tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div>
      <Button variant="default">默认按钮</Button>
      <Button variant="outline">轮廓按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
    </div>
  );
}
\`\`\`

### Card 组件
\`\`\`tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArticleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>文章标题</CardTitle>
      </CardHeader>
      <CardContent>
        <p>文章内容...</p>
      </CardContent>
    </Card>
  );
}
\`\`\`

## 自定义主题

### 配置颜色
\`\`\`css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
}
\`\`\`

## 最佳实践

1. **组件组合**：合理组合多个基础组件
2. **样式覆盖**：使用 className 属性自定义样式
3. **类型安全**：充分利用 TypeScript 类型定义
4. **可访问性**：保持组件的可访问性特性

## 总结

shadcn/ui 为现代 React 应用提供了强大的组件基础，合理使用可以大大提高开发效率。`,
    date: "2024年1月8日",
    readTime: "10分钟阅读",
    category: "UI/UX",
    tags: ["shadcn/ui", "组件库", "UI", "React"],
    author: "技术团队",
    slug: "shadcn-ui-guide"
  },
  {
    id: 5,
    title: "现代前端开发工作流",
    description: "建立高效的前端开发工作流，包括代码规范、测试和部署流程。",
    content: `# 现代前端开发工作流

建立高效的前端开发工作流是提高团队生产力的关键。

## 代码规范

### ESLint 配置
\`\`\`javascript
// eslint.config.js
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'prefer-const': 'error',
    'no-unused-vars': 'warn'
  }
};
\`\`\`

### Prettier 配置
\`\`\json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80
}
\`\`\`

## 版本控制

### Git Hooks
\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
\`\`\`

## 测试策略

### 单元测试
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
\`\`\`

## 部署流程

### CI/CD 配置
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
\`\`\`

## 总结

良好的开发工作流是项目成功的基础，值得投入时间进行优化和完善。`,
    date: "2024年1月5日",
    readTime: "15分钟阅读",
    category: "开发工具",
    tags: ["工作流", "CI/CD", "测试", "代码规范"],
    author: "技术团队",
    slug: "modern-frontend-workflow"
  },
  {
    id: 6,
    title: "React 19 新特性预览",
    description: "提前了解 React 19 即将带来的新功能和改进，为未来做好准备。",
    content: `# React 19 新特性预览

React 19 即将带来许多令人兴奋的新特性，让我们提前了解这些变化。

## 主要新特性

### 1. 并发特性增强
React 19 进一步改进了并发渲染能力，提供更流畅的用户体验。

\`\`\`tsx
import { use, Suspense } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
\`\`\`

### 2. 改进的 Hooks
新的 Hooks 提供了更强大的功能：

\`\`\`tsx
import { useOptimistic, useActionState } from 'react';

function TodoApp() {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
\`\`\`

### 3. 更好的 TypeScript 支持
React 19 提供了更完善的 TypeScript 类型定义。

## 迁移准备

### 1. 更新依赖
\`\`\`bash
npm install react@19 react-dom@19
\`\`\`

### 2. 检查破坏性变更
- 某些 API 可能发生变化
- 需要更新相关依赖

### 3. 测试应用
确保应用在新版本下正常工作

## 总结

React 19 是一个重要的版本更新，建议开发者提前了解新特性并做好迁移准备。`,
    date: "2024年1月3日",
    readTime: "9分钟阅读",
    category: "React",
    tags: ["React", "React 19", "并发", "Hooks"],
    author: "技术团队",
    slug: "react-19-preview"
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter(article => article.featured);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.description.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getAllTags(): string[] {
  const allTags = articles.flatMap(article => article.tags);
  return Array.from(new Set(allTags)).sort();
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter(article => 
    article.tags.some(articleTag => articleTag.toLowerCase() === tag.toLowerCase())
  );
}

// 获取所有文章（包括预设文章和用户创建的文章）
export function getAllArticles(): Article[] {
  if (typeof window === 'undefined') {
    // 服务端渲染时只返回预设文章
    return articles;
  }

  try {
    const stored = localStorage.getItem('userArticles');
    if (!stored) return articles;
    
    const userArticles: Article[] = JSON.parse(stored);
    return [...articles, ...userArticles];
  } catch (error) {
    console.error('Error loading user articles:', error);
    return articles;
  }
}

// 根据slug获取文章（包括用户创建的文章）
export function getArticleBySlug(slug: string): Article | null {
  const allArticles = getAllArticles();
  return allArticles.find(article => article.slug === slug) || null;
}

// 根据ID获取文章（包括用户创建的文章）
export function getArticleById(id: number): Article | null {
  const allArticles = getAllArticles();
  return allArticles.find(article => article.id === id) || null;
}
