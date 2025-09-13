"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  articleId: number;
  articleTitle?: string;
  className?: string;
}

export default function FavoriteButton({ articleId, articleTitle, className }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从localStorage获取收藏状态
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(articleId));
  }, [articleId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (isFavorited) {
      newFavorites = favorites.filter((id: number) => id !== articleId);
    } else {
      newFavorites = [...favorites, articleId];
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  // 防止水合不匹配
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`w-8 h-8 p-0 ${className}`}
        disabled
      >
        <Heart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      className={`w-8 h-8 p-0 transition-colors ${className} ${
        isFavorited
          ? "text-red-500 hover:text-red-600"
          : "text-slate-400 hover:text-red-500"
      }`}
      aria-label={isFavorited ? "取消收藏" : "收藏文章"}
    >
      <Heart 
        className={`h-4 w-4 transition-all ${
          isFavorited ? "fill-current" : ""
        }`} 
      />
    </Button>
  );
}
