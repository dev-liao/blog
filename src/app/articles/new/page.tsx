'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Article } from '@/lib/articles';

export default function NewArticlePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async (articleData: Partial<Article>) => {
    setIsSaving(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里会调用API保存文章
      console.log('Saving article:', articleData);
      
      // 模拟成功响应
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: '保存文章时发生错误，请重试' 
      };
    } finally {
      setIsSaving(false);
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
      />
    </div>
  );
}
