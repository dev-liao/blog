// 服务端文章加载工具
import { getAllArticles, getArticlesByCategory } from './articles';

// 分类映射
const categoryMapping: Record<string, string> = {
  reading: '读书',
  life: '生活',
  tech: '技术',
  collection: '收藏',
  articles: '技术', // articles 路径对应技术分类
};

// 根据路径获取分类名称
export function getCategoryByPath(path: string): string | null {
  if (path === 'articles' || path === 'tech') {
    return '技术';
  }
  return categoryMapping[path] || null;
}

// 获取指定分类的文章
export function getCategoryArticles(path: string) {
  const category = getCategoryByPath(path);
  if (!category) {
    return getAllArticles();
  }
  return getArticlesByCategory(category);
}

