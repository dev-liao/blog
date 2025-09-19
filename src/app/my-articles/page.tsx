'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SupabaseArticleService, ArticleWithAuthor } from '@/lib/supabaseArticles';
import { canAccessAdmin } from '@/lib/permissions';
import { supabase } from '@/lib/supabase';

export default function MyArticlesPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [myArticles, setMyArticles] = useState<ArticleWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/');
    }
    
    // 检查管理员权限
    if (!isLoading && isAuthenticated && user && !canAccessAdmin(user)) {
      redirect('/');
    }
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    // 获取用户文章
    const fetchMyArticles = async () => {
      setLoading(true);
      
      if (user) {
        try {
          // 从 Supabase 获取用户文章
          const userArticles = await SupabaseArticleService.getUserArticles(user.id);
          setMyArticles(userArticles);
        } catch (error) {
          console.error('Error fetching user articles:', error);
          setMyArticles([]);
        }
      }
      
      setLoading(false);
    };

    if (user) {
      fetchMyArticles();
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return;
    }

    if (!user) return;

    try {
      // 获取 Supabase 会话 token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('用户未登录或会话已过期')
      }

      // 调用 API 删除文章
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

      // 更新本地状态
      setMyArticles(prev => prev.filter(article => article.id !== articleId));
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">我的文章</h1>
            <p className="text-muted-foreground mt-2">
              管理您创建的所有文章
            </p>
          </div>
          <Button asChild>
            <Link href="/articles/new">
              <Plus className="mr-2 h-4 w-4" />
              写新文章
            </Link>
          </Button>
        </div>

        {myArticles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">还没有文章</h3>
                <p className="text-muted-foreground mb-4">
                  开始创建您的第一篇文章吧！
                </p>
                <Button asChild>
                  <Link href="/articles/new">
                    <Plus className="mr-2 h-4 w-4" />
                    写新文章
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {myArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        <Link 
                          href={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/articles/${article.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/articles/${article.slug}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id.toString())}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(article.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {article.tags?.join(', ') || '无标签'}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>状态：{article.published ? '已发布' : '草稿'}</span>
                    </div>
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
