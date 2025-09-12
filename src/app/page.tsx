import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header currentPage="home" />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        {/* 英雄区域 */}
        <section className="text-center py-20">
          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            欢迎来到我的博客
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            基于 Next.js 14+、TypeScript、Tailwind CSS 和 shadcn/ui 构建的现代化博客平台
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">开始阅读</Button>
            <Button variant="outline" size="lg">了解更多</Button>
          </div>
        </section>

        {/* 特色文章 */}
        <section className="py-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            最新文章
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>文章标题 {i}</CardTitle>
                  <CardDescription>
                    这是一篇关于 Next.js 和现代前端开发的精彩文章...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    2024年1月{i}日 · 5分钟阅读
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 技术栈展示 */}
        <section className="py-12 bg-white dark:bg-slate-800 rounded-lg p-8">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            技术栈
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", desc: "React 框架" },
              { name: "TypeScript", desc: "类型安全" },
              { name: "Tailwind CSS", desc: "样式框架" },
              { name: "shadcn/ui", desc: "组件库" },
            ].map((tech, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                    {tech.name[0]}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{tech.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
