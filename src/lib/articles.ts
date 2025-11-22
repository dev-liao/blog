import { 
  getAllMarkdownArticles, 
  getMarkdownArticlesByCategory, 
  getMarkdownArticleBySlug 
} from './markdown';

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  slug: string;
  featured?: boolean;
}

// 预设文章数组，现在主要由 markdown 文件管理
// 如果需要在代码中保留一些示例文章，可以在这里添加
export const articles: Article[] = [];

export function getArticleBySlug(slug: string): Article | undefined {
  const allArticles = getAllArticles();
  let article = allArticles.find(article => article.slug === slug);
  
  // 如果在预设文章中没找到，尝试从 markdown 文件加载
  if (!article && typeof window === 'undefined') {
    try {
      article = getMarkdownArticleBySlug(slug) || undefined;
    } catch (error) {
      console.error('Error loading markdown article:', error);
    }
  }
  
  return article;
}

export function getFeaturedArticles(): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.featured);
}

export function getArticlesByCategory(category: string): Article[] {
  let categoryArticles = articles.filter(article => article.category === category);
  
  // 在服务端或构建时，加载对应分类的 markdown 文章
  if (typeof window === 'undefined') {
    try {
      const markdownArticles = getMarkdownArticlesByCategory(category);
      categoryArticles = [...categoryArticles, ...markdownArticles];
    } catch (error) {
      console.error('Error loading markdown articles by category:', error);
    }
  }
  
  return categoryArticles;
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  const allArticles = getAllArticles();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.description.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getAllTags(): string[] {
  const allArticles = getAllArticles();
  const allTags = allArticles.flatMap(article => article.tags);
  return Array.from(new Set(allTags)).sort();
}

export function getArticlesByTag(tag: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => 
    article.tags.some(articleTag => articleTag.toLowerCase() === tag.toLowerCase())
  );
}

// 获取所有文章（包括预设文章、markdown文章和用户创建的文章）
export function getAllArticles(): Article[] {
  let allArticles = [...articles];
  
  // 在服务端或构建时，加载 markdown 文章
  if (typeof window === 'undefined') {
    try {
      const markdownArticles = getAllMarkdownArticles();
      allArticles = [...allArticles, ...markdownArticles];
    } catch (error) {
      console.error('Error loading markdown articles:', error);
    }
  }

  // 在客户端，尝试从 localStorage 加载用户文章
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('userArticles');
      if (stored) {
        const userArticles: Article[] = JSON.parse(stored);
        allArticles = [...allArticles, ...userArticles];
      }
    } catch (error) {
      console.error('Error loading user articles:', error);
    }
  }

  return allArticles;
}

