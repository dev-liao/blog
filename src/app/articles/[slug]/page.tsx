import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/articles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await import("@/lib/articles").then(m => m.articles);
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: "文章未找到",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header currentPage="articles" />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-8">
            <Link href="/articles">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回文章列表
              </Button>
            </Link>
          </div>

          {/* 文章头部信息 */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                    精选
                  </span>
                )}
              </div>
              
              <CardTitle className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {article.title}
              </CardTitle>
              
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                {article.description}
              </CardDescription>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* 文章内容 */}
          <Card className="mb-8">
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '<br>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>')
                }}
              />
            </CardContent>
          </Card>

          {/* 评论系统 */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <CommentSection articleId={article.id} />
            </CardContent>
          </Card>

          {/* 相关文章 */}
          {relatedArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  相关文章
                </CardTitle>
                <CardDescription>
                  更多关于 {article.category} 的文章
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/articles/${relatedArticle.slug}`}
                      className="block"
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-lg">{relatedArticle.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {relatedArticle.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                            <span>{relatedArticle.date}</span>
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
