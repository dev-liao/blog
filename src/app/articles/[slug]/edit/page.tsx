'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { getArticleBySlug, Article } from '@/lib/articles';

interface EditArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}


export default function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = use(params);
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      // 获取文章数据
      const articleData = getArticleBySlug(resolvedParams.slug);
      if (!articleData) {
        notFound();
      }
      
      // 检查用户是否有权限编辑此文章
      if (articleData.author !== user?.name && user?.role !== 'admin') {
        router.push('/my-articles');
        return;
      }
      
      setArticle(articleData);
      setLoading(false);
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
    setIsSaving(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里会调用API更新文章
      console.log('Updating article:', articleData);
      
      // 模拟成功响应
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: '更新文章时发生错误，请重试' 
      };
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSaveSuccess = () => {
    // 保存成功后跳转到文章详情页面
    router.push(`/articles/${article.slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleEditor
        article={article}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
