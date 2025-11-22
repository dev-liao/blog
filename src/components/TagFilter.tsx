"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagFilterProps {
  tags: string[];  // 可用标签列表（从当前页面文章生成）
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({ tags = [], selectedTags, onTagToggle, onClearAll }: TagFilterProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          标签筛选
        </h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            清除全部
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onTagToggle(tag)}
              className={`transition-all ${
                isSelected
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tag}
              {isSelected && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          已选择 {selectedTags.length} 个标签
        </div>
      )}
    </div>
  );
}
