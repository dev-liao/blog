'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Article } from '@/lib/articles';
import { supabase } from '@/lib/supabase';
import { canAccessAdmin } from '@/lib/permissions';

export default function NewArticlePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
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
              请先登录后再创建文章。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin(user)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              您没有权限创建文章。只有管理员用户可以创建文章。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleSave = async (articleData: Partial<Article>) => {
    try {
      if (!user) {
        return { 
          success: false, 
          error: '用户未登录' 
        };
      }

      // 生成 slug
      const slug = articleData.slug || 
        (articleData.title ? 
          articleData.title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '') 
          : 'untitled');

      // 获取 Supabase 会话 token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('用户未登录或会话已过期')
      }

      // 调用 Supabase API 保存文章
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: articleData.title || '未命名文章',
          content: articleData.content || '',
          excerpt: articleData.description || articleData.content?.substring(0, 200) || '',
          slug: slug,
          author_id: user.id,
          tags: articleData.tags || [],
          published: false, // 默认为草稿
          featured_image: null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存文章失败');
      }

      const result = await response.json();
      console.log('Article saved to Supabase:', result.article);
      
      return { success: true };
    } catch (error) {
      console.error('Error saving article:', error);
      return { 
        success: false, 
        error: '保存文章时发生错误: ' + (error as Error).message
      };
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSaveSuccess = () => {
    // 保存成功后跳转到我的文章页面
    router.push('/my-articles');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
