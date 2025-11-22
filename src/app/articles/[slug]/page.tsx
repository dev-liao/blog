import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, type Article as LocalArticle } from "@/lib/articles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// 转换日期格式：从"2024年1月15日"转换为ISO字符串
function parseDate(dateStr: string): string {
  try {
    // 处理"2024年1月15日"格式
    const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toISOString();
    }
    // 如果无法解析，返回当前日期
    return new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// 转换本地文章格式为页面显示格式
function convertToDisplayFormat(article: LocalArticle) {
  const dateISO = parseDate(article.date);
  return {
    id: article.id.toString(),
    title: article.title,
    excerpt: article.description,
    content: article.content,
    slug: article.slug,
    author: {
      id: '1',
      name: article.author,
      avatar_url: undefined,
    },
    tags: article.tags || [],
    published: true,
    created_at: dateISO,
    updated_at: dateISO,
  };
}

export async function generateStaticParams() {
  try {
    const articles = getAllArticles();
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const localArticle = getArticleBySlug(slug);
    
    if (!localArticle) {
      return {
        title: "文章未找到",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const articleUrl = `${baseUrl}/articles/${localArticle.slug}`;

    return {
      title: localArticle.title,
      description: localArticle.description,
      keywords: localArticle.tags,
      authors: [{ name: localArticle.author || '未知作者' }],
      openGraph: {
        title: localArticle.title,
        description: localArticle.description,
        url: articleUrl,
        type: "article",
        publishedTime: parseDate(localArticle.date),
        authors: [localArticle.author || '未知作者'],
        tags: localArticle.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: localArticle.title,
        description: localArticle.description,
      },
      alternates: {
        canonical: articleUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "文章未找到",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  try {
    const localArticle = getArticleBySlug(slug);
    
    if (!localArticle) {
      console.log('Article not found for slug:', slug);
      notFound();
    }

    const article = convertToDisplayFormat(localArticle);
    
    // 获取所有文章用于相关文章推荐
    const allArticles = getAllArticles();
    const relatedArticles = allArticles
      .filter(a => a.id !== localArticle.id)
      .filter(a => a.tags?.some(tag => localArticle.tags?.some(localTag => localTag.toLowerCase() === tag.toLowerCase())))
      .slice(0, 3)
      .map(convertToDisplayFormat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
                  {article.published ? '已发布' : '草稿'}
                </span>
              </div>
              
              <CardTitle className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {article.title}
              </CardTitle>
              
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                {article.excerpt}
              </CardDescription>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author?.name || '未知作者'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags?.map((tag, index) => (
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
              <CommentSection articleId={article.id.toString()} />
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
                  相关文章
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
                            {relatedArticle.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                            <span>{new Date(relatedArticle.created_at).toLocaleDateString('zh-CN')}</span>
                            <span>{Math.ceil(relatedArticle.content.length / 500)}分钟阅读</span>
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
    </div>
  );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
