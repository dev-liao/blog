import { Article } from './articles';

// 文章管理服务
export class ArticleService {
  private static STORAGE_KEY = 'userArticles';
  private static NEXT_ID_KEY = 'nextArticleId';

  // 获取下一个文章ID
  private static getNextId(): number {
    const nextId = localStorage.getItem(this.NEXT_ID_KEY);
    return nextId ? parseInt(nextId, 10) : 1000; // 从1000开始，避免与预设文章冲突
  }

  // 设置下一个文章ID
  private static setNextId(id: number): void {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }

  // 获取所有用户文章
  static getUserArticles(userId: string): Article[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    const allArticles: Article[] = JSON.parse(stored);
    return allArticles.filter(article => article.author === userId);
  }

  // 保存文章
  static saveArticle(articleData: Partial<Article>, userId: string): Article {
    const articles = this.getAllUserArticles();
    const nextId = this.getNextId();
    
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
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
    this.setNextId(nextId + 1);

    return newArticle;
  }

  // 更新文章
  static updateArticle(articleId: number, articleData: Partial<Article>, userId: string): Article | null {
    const articles = this.getAllUserArticles();
    const index = articles.findIndex(article => article.id === articleId && article.author === userId);
    
    if (index === -1) return null;

    const updatedArticle: Article = {
      ...articles[index],
      ...articleData,
      id: articleId, // 保持原ID
      author: userId, // 保持原作者
    };

    articles[index] = updatedArticle;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));

    return updatedArticle;
  }

  // 删除文章
  static deleteArticle(articleId: number, userId: string): boolean {
    const articles = this.getAllUserArticles();
    const index = articles.findIndex(article => article.id === articleId && article.author === userId);
    
    if (index === -1) return false;

    articles.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));

    return true;
  }

  // 获取所有用户文章（包括预设文章）
  static getAllUserArticles(): Article[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  }

  // 根据ID获取文章
  static getArticleById(articleId: number): Article | null {
    const articles = this.getAllUserArticles();
    return articles.find(article => article.id === articleId) || null;
  }

  // 根据slug获取文章
  static getArticleBySlug(slug: string): Article | null {
    const articles = this.getAllUserArticles();
    return articles.find(article => article.slug === slug) || null;
  }

  // 获取所有文章（包括预设文章和用户文章）
  static getAllArticles(): Article[] {
    // 这里需要导入预设文章，但为了避免循环依赖，我们通过参数传递
    return [];
  }
}
