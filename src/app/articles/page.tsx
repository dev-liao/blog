import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: "Next.js 15 新特性详解",
      description: "深入了解 Next.js 15 带来的新功能和改进，包括 App Router 的优化和性能提升。",
      date: "2024年1月15日",
      readTime: "8分钟阅读",
      category: "Next.js"
    },
    {
      id: 2,
      title: "TypeScript 最佳实践指南",
      description: "学习如何在 React 和 Next.js 项目中有效使用 TypeScript，提高代码质量和开发效率。",
      date: "2024年1月12日",
      readTime: "12分钟阅读",
      category: "TypeScript"
    },
    {
      id: 3,
      title: "Tailwind CSS 高级技巧",
      description: "掌握 Tailwind CSS 的高级用法，包括自定义主题、响应式设计和组件化开发。",
      date: "2024年1月10日",
      readTime: "6分钟阅读",
      category: "CSS"
    },
    {
      id: 4,
      title: "shadcn/ui 组件库使用指南",
      description: "如何使用 shadcn/ui 快速构建美观的用户界面，提高开发效率。",
      date: "2024年1月8日",
      readTime: "10分钟阅读",
      category: "UI/UX"
    },
    {
      id: 5,
      title: "现代前端开发工作流",
      description: "建立高效的前端开发工作流，包括代码规范、测试和部署流程。",
      date: "2024年1月5日",
      readTime: "15分钟阅读",
      category: "开发工具"
    },
    {
      id: 6,
      title: "React 19 新特性预览",
      description: "提前了解 React 19 即将带来的新功能和改进，为未来做好准备。",
      date: "2024年1月3日",
      readTime: "9分钟阅读",
      category: "React"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header currentPage="articles" />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              技术文章
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              分享前端开发经验和技术见解
            </p>
          </div>

          {/* 文章列表 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {article.date}
                    </span>
                    <Button variant="ghost" size="sm">
                      阅读更多 →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 加载更多 */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              加载更多文章
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
