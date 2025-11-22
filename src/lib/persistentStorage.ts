import { Article } from './articles';

// 数据持久化服务
export class PersistentStorage {
  private static STORAGE_KEY = 'blog_articles_db';
  
  // 从localStorage加载数据
  private static loadData(): Article[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return [];
    }
  }
  
  // 保存数据到localStorage
  private static saveData(data: Article[]): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }
  
  // 获取所有文章
  static getAllArticles(): Article[] {
    return this.loadData();
  }
  
  // 根据ID获取文章
  static getArticleById(id: number): Article | null {
    const articles = this.loadData();
    return articles.find(article => article.id === id) || null;
  }
  
  // 根据slug获取文章
  static getArticleBySlug(slug: string): Article | null {
    const articles = this.loadData();
    return articles.find(article => article.slug === slug) || null;
  }
  
  // 获取用户文章
  static getUserArticles(userId: string): Article[] {
    const articles = this.loadData();
    return articles.filter(article => article.author === userId);
  }
  
  // 保存文章
  static saveArticle(articleData: Partial<Article>, userId: string): Article {
    const articles = this.loadData();
    const nextId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
    
    const newArticle: Article = {
      id: nextId,
      title: articleData.title || '',
      description: articleData.description || '',
      content: articleData.content || '',
      date: articleData.date || new Date().toISOString(),
      readTime: articleData.readTime || '1分钟阅读',
      category: articleData.category || '未分类',
      tags: articleData.tags || [],
      author: userId,
      slug: articleData.slug || '',
      featured: false,
    };
    
    articles.push(newArticle);
    this.saveData(articles);
    
    return newArticle;
  }
  
  // 更新文章
  static updateArticle(articleId: number, articleData: Partial<Article>, userId: string): Article | null {
    const articles = this.loadData();
    const index = articles.findIndex(article => article.id === articleId && article.author === userId);
    
    if (index === -1) return null;
    
    const updatedArticle: Article = {
      ...articles[index],
      ...articleData,
      id: articleId,
      author: userId,
    };
    
    articles[index] = updatedArticle;
    this.saveData(articles);
    
    return updatedArticle;
  }
  
  // 删除文章
  static deleteArticle(articleId: number, userId: string): boolean {
    const articles = this.loadData();
    const index = articles.findIndex(article => article.id === articleId && article.author === userId);
    
    if (index === -1) return false;
    
    articles.splice(index, 1);
    this.saveData(articles);
    
    return true;
  }
  
  // 初始化预设文章
  static initializePresetArticles(presetArticles: Article[]): void {
    const existingArticles = this.loadData();
    const existingIds = new Set(existingArticles.map(a => a.id));
    
    // 只添加不存在的预设文章
    const newArticles = presetArticles.filter(article => !existingIds.has(article.id));
    
    if (newArticles.length > 0) {
      const allArticles = [...existingArticles, ...newArticles];
      this.saveData(allArticles);
    }
  }
}


