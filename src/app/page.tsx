import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";
import { getFeaturedArticles } from "@/lib/articles";

export default function Home() {
  const featuredArticles = getFeaturedArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
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
            精选文章
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {article.date}
                      </p>
                      <FavoriteButton 
                        articleId={article.id} 
                        articleTitle={article.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
      </div>
    </div>
  );
}
