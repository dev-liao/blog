'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { canAccessAdmin } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, FileText, Eye, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { SupabaseArticleService } from '@/lib/supabaseArticles';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalUsers: 0,
  });
  const [articles, setArticles] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    published: boolean;
    created_at: string;
    tags: string[];
    author?: {
      name: string;
    };
  }>>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const loadArticles = async () => {
    try {
      setArticlesLoading(true);
      const allArticles = await SupabaseArticleService.getPublishedArticles();
      setArticles(allArticles);
      
      // 更新统计数据
      setStats({
        totalArticles: allArticles.length,
        publishedArticles: allArticles.filter(article => article.published).length,
        draftArticles: allArticles.filter(article => !article.published).length,
        totalUsers: 2, // 模拟用户数量
      });
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (user && !canAccessAdmin(user)) {
      router.push('/');
      return;
    }

    if (user) {
      loadArticles();
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !canAccessAdmin(user)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              您没有权限访问管理后台。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return;
    }

    try {
      // 获取 Supabase 会话 token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('用户未登录或会话已过期')
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除文章失败');
      }

      // 删除成功后重新加载文章列表
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('删除文章失败: ' + (error as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className="text-muted-foreground mt-2">
            管理博客内容和用户
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总文章数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                所有文章总数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已发布</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedArticles}</div>
              <p className="text-xs text-muted-foreground">
                已发布的文章
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">草稿</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftArticles}</div>
              <p className="text-xs text-muted-foreground">
                待发布的草稿
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">用户数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                注册用户总数
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 文章管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>文章管理</CardTitle>
                <CardDescription>
                  管理所有博客文章
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/articles/new">
                  <Plus className="mr-2 h-4 w-4" />
                  新建文章
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {articlesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">加载文章中...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>作者：{article.author?.name || '未知'}</span>
                      <span>标签：{article.tags?.join(', ') || '无'}</span>
                      <span>日期：{formatDate(article.created_at)}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        article.published 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {article.published ? '已发布' : '草稿'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/articles/${article.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/articles/${article.slug}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
