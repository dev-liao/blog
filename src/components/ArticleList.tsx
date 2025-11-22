"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TagFilter from "@/components/TagFilter";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";
import { type Article } from "@/lib/articles";

interface ArticleListProps {
  initialArticles: Article[];
  title: string;
  description: string;
}

export default function ArticleList({ initialArticles, title, description }: ArticleListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return initialArticles;
    }
    
    return initialArticles.filter(article =>
      selectedTags.every(tag =>
        article.tags.some(articleTag => 
          articleTag.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  }, [selectedTags, initialArticles]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  // 获取当前文章的所有标签
  const availableTags = useMemo(() => {
    const allTags = initialArticles.flatMap(article => article.tags);
    return Array.from(new Set(allTags)).sort();
  }, [initialArticles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          {/* 标签筛选 */}
          {availableTags.length > 0 && (
            <div className="mb-8">
              <TagFilter
                tags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearAll}
              />
            </div>
          )}

          {/* 文章列表 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {article.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <FavoriteButton 
                            articleId={article.id} 
                            articleTitle={article.title}
                          />
                          <Button variant="ghost" size="sm">
                            阅读更多 →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">暂无文章</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

