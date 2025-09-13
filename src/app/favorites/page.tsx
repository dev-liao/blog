'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Heart, Calendar, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { articles, Article } from '@/lib/articles';

export default function FavoritesPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/');
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    // 从localStorage获取收藏的文章
    const fetchFavoriteArticles = async () => {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (typeof window !== 'undefined') {
        const favorites = localStorage.getItem('favoriteArticles');
        if (favorites) {
          try {
            const favoriteIds = JSON.parse(favorites);
            const favoriteArticlesList = articles.filter(article => 
              favoriteIds.includes(article.id)
            );
            setFavoriteArticles(favoriteArticlesList);
          } catch (error) {
            console.error('Error parsing favorite articles:', error);
          }
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchFavoriteArticles();
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

  const handleRemoveFavorite = (articleId: string) => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('favoriteArticles');
      if (favorites) {
        try {
          const favoriteIds = JSON.parse(favorites);
          const updatedFavorites = favoriteIds.filter((id: string) => id !== articleId);
          localStorage.setItem('favoriteArticles', JSON.stringify(updatedFavorites));
          setFavoriteArticles(prev => prev.filter(article => article.id.toString() !== articleId));
        } catch (error) {
          console.error('Error updating favorites:', error);
        }
      }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">我的收藏</h1>
          <p className="text-muted-foreground mt-2">
            您收藏的所有文章
          </p>
        </div>

        {favoriteArticles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">还没有收藏文章</h3>
                <p className="text-muted-foreground mb-4">
                  浏览文章并点击心形图标来收藏您喜欢的文章
                </p>
                <Button asChild>
                  <Link href="/articles">
                    浏览文章
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {favoriteArticles.map((article) => (
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
                        {article.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(article.id.toString())}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(article.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {article.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>阅读时间：{article.readTime}分钟</span>
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
