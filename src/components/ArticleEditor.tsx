'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye, Plus, X } from 'lucide-react';
import { Article } from '@/lib/articles';

interface ArticleEditorProps {
  article?: Article;
  onSave: (articleData: Partial<Article>) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  onSaveSuccess?: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel, onSaveSuccess }: ArticleEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
  });
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category,
        tags: article.tags || [],
        status: 'draft', // 编辑时默认为草稿
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: '标题和内容不能为空' });
      setIsSaving(false);
      return;
    }

    const articleData: Partial<Article> = {
      ...formData,
      slug: formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      author: '当前用户', // 在实际应用中应该从认证上下文获取
      date: new Date().toISOString(),
      readTime: `${Math.ceil(formData.content.length / 500)}分钟阅读`, // 估算阅读时间
    };

    const result = await onSave(articleData);
    
    if (result.success) {
      setMessage({ type: 'success', text: '文章保存成功' });
      // 如果是新建文章且没有传入onSaveSuccess，延迟跳转
      if (!article && !onSaveSuccess) {
        setTimeout(() => {
          window.location.href = '/my-articles';
        }, 1500);
      } else if (onSaveSuccess) {
        setTimeout(() => {
          onSaveSuccess();
        }, 1500);
      }
    } else {
      setMessage({ type: 'error', text: result.error || '保存失败' });
    }
    
    setIsSaving(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {article ? '编辑文章' : '写新文章'}
                </CardTitle>
                <CardDescription>
                  {article ? '修改您的文章内容' : '创建一篇新的博客文章'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {isPreview ? '编辑' : '预览'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="输入文章标题"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="输入文章分类"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">摘要</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="输入文章摘要"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">标签</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入标签并按回车添加"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容 *</Label>
              {isPreview ? (
                <div className="min-h-[400px] p-4 border rounded-md bg-muted/50">
                  <div className="prose max-w-none">
                    <h1>{formData.title}</h1>
                    {formData.description && (
                      <p className="text-muted-foreground text-lg">{formData.description}</p>
                    )}
                    <div className="whitespace-pre-wrap">{formData.content}</div>
                  </div>
                </div>
              ) : (
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="输入文章内容（支持Markdown格式）"
                  rows={20}
                  required
                />
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
