"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { searchArticles, Article } from "@/lib/articles";

interface SearchBarProps {
  onSearch?: (results: Article[]) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "搜索文章..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchArticles(query);
      setResults(searchResults);
      onSearch?.(searchResults);
    } else {
      setResults([]);
      onSearch?.([]);
    }
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onSearch?.([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.slice(0, 5).map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Card className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer mb-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{article.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {results.length > 5 && (
                <div className="text-center py-2 text-sm text-slate-500 dark:text-slate-400">
                  还有 {results.length - 5} 个结果...
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              没有找到相关文章
            </div>
          )}
        </div>
      )}

      {/* 点击外部关闭下拉框 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
