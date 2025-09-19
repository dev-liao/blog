'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Article } from '@/lib/articles';
import { SupabaseArticleService, ArticleWithAuthor } from '@/lib/supabaseArticles';
import { supabase } from '@/lib/supabase';
import { canAccessAdmin } from '@/lib/permissions';

interface EditArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}


export default function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = use(params);
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      // 检查用户是否有权限编辑此文章（只有管理员可以编辑）
      if (!canAccessAdmin(user)) {
        router.push('/');
        return;
      }

      // 获取文章数据
      const loadArticle = async () => {
        try {
          const articles = await SupabaseArticleService.getPublishedArticles();
          const articleData = articles.find(a => a.slug === resolvedParams.slug);
          if (!articleData) {
            notFound();
          }
          setArticle(articleData);
        } catch (error) {
          console.error('Error loading article:', error);
          notFound();
        } finally {
          setLoading(false);
        }
      };

      loadArticle();
    }
  }, [isAuthenticated, isLoading, resolvedParams.slug, user, router]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertDescription>
              请先登录后再编辑文章。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              文章不存在或您没有权限编辑此文章。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleSave = async (articleData: Partial<Article>) => {
    try {
      if (!user || !article) {
        return { 
          success: false, 
          error: '用户未登录或文章不存在' 
        };
      }

      // 生成 slug
      const slug = articleData.slug || 
        (articleData.title ? 
          articleData.title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '') 
          : article.slug);

      // 获取 Supabase 会话 token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('用户未登录或会话已过期')
      }

      // 调用 Supabase API 更新文章
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: articleData.title || article.title,
          content: articleData.content || article.content,
          excerpt: articleData.description || articleData.content?.substring(0, 200) || article.excerpt,
          slug: slug,
          tags: articleData.tags || article.tags,
          published: true, // 编辑时默认为已发布
          featured_image: null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新文章失败');
      }

      const result = await response.json();
      console.log('Article updated in Supabase:', result.article);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating article:', error);
      return { 
        success: false, 
        error: '更新文章时发生错误: ' + (error as Error).message
      };
    }
  };

  const handleCancel = () => {
    router.back();
  };


  // 将 Supabase 文章数据转换为 ArticleEditor 期望的格式
  const articleForEditor = article ? {
    id: parseInt(article.id.replace(/-/g, '').substring(0, 8), 16), // 将 UUID 转换为数字
    title: article.title,
    description: article.excerpt,
    content: article.content,
    category: '技术', // 默认分类
    tags: article.tags || [],
    author: article.author?.name || '未知作者',
    slug: article.slug,
    date: article.created_at,
    readTime: `${Math.ceil(article.content.length / 500)}分钟阅读`,
    featured: false
  } : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleEditor
        article={articleForEditor || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
