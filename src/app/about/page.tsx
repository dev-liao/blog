import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header currentPage="about" />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            关于这个博客
          </h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>项目介绍</CardTitle>
              <CardDescription>
                这是一个使用现代技术栈构建的博客平台
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                这个博客项目展示了如何使用 Next.js 14+ 的最新特性，包括 App Router、TypeScript、
                Tailwind CSS 和 shadcn/ui 组件库来构建一个现代化、响应式的博客网站。
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                项目采用了最新的前端开发最佳实践，提供了优秀的开发体验和用户体验。
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>技术特性</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li>• Next.js 15 最新版本</li>
                  <li>• TypeScript 类型安全</li>
                  <li>• Tailwind CSS 样式框架</li>
                  <li>• shadcn/ui 组件库</li>
                  <li>• App Router 路由系统</li>
                  <li>• 响应式设计</li>
                  <li>• 深色模式支持</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>开发工具</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li>• ESLint 代码检查</li>
                  <li>• Prettier 代码格式化</li>
                  <li>• TypeScript 编译器</li>
                  <li>• Tailwind CSS 编译器</li>
                  <li>• Next.js 开发服务器</li>
                  <li>• 热重载支持</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
