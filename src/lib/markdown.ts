import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { Article } from './articles';

// 文章分类映射
const categoryMap: Record<string, string> = {
  reading: '读书',
  life: '生活',
  tech: '技术',
  collection: '收藏',
};

// Markdown 文件 frontmatter 接口
interface MarkdownFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  featured?: boolean;
  published?: boolean;
}

// 文章文件路径（相对于项目根目录）
const contentDir = path.join(process.cwd(), 'content');

// 读取并解析单个 markdown 文件
function parseMarkdownFile(filePath: string, category: string): Article | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const frontmatter = data as MarkdownFrontmatter;
    
    if (!frontmatter.published && frontmatter.published !== undefined) {
      return null; // 未发布的文章不返回
    }
    
    // 计算阅读时间（每分钟约500字）
    const readTime = Math.ceil(content.length / 500);
    
    return {
      id: Math.abs(filePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)), // 基于文件路径生成ID
      title: frontmatter.title,
      description: frontmatter.description,
      content: content.trim(),
      date: frontmatter.date || new Date().toLocaleDateString('zh-CN'),
      readTime: `${readTime}分钟阅读`,
      category: categoryMap[category] || frontmatter.category || '未分类',
      tags: frontmatter.tags || [],
      author: frontmatter.author || '作者',
      slug: frontmatter.slug || path.basename(filePath, '.md'),
      featured: frontmatter.featured || false,
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return null;
  }
}

// 读取指定分类目录下的所有 markdown 文件
function getMarkdownArticles(category: string): Article[] {
  const categoryDir = path.join(contentDir, category);
  
  if (!fs.existsSync(categoryDir)) {
    return [];
  }
  
  try {
    const files = fs.readdirSync(categoryDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const articles: Article[] = [];
    
    for (const file of markdownFiles) {
      const filePath = path.join(categoryDir, file);
      const article = parseMarkdownFile(filePath, category);
      if (article) {
        articles.push(article);
      }
    }
    
    // 按日期排序（最新的在前）
    articles.sort((a, b) => {
      const dateA = new Date(a.date.replace('年', '-').replace('月', '-').replace('日', ''));
      const dateB = new Date(b.date.replace('年', '-').replace('月', '-').replace('日', ''));
      return dateB.getTime() - dateA.getTime();
    });
    
    return articles;
  } catch (error) {
    console.error(`Error reading markdown articles from ${category}:`, error);
    return [];
  }
}

// 获取所有分类的 markdown 文章
export function getAllMarkdownArticles(): Article[] {
  const categories = ['reading', 'life', 'tech', 'collection'];
  const allArticles: Article[] = [];
  
  for (const category of categories) {
    const articles = getMarkdownArticles(category);
    allArticles.push(...articles);
  }
  
  return allArticles;
}

// 根据分类获取 markdown 文章
export function getMarkdownArticlesByCategory(category: string): Article[] {
  const categoryMap: Record<string, string> = {
    '读书': 'reading',
    '生活': 'life',
    '技术': 'tech',
    '收藏': 'collection',
  };
  
  const dirName = categoryMap[category] || category.toLowerCase();
  return getMarkdownArticles(dirName);
}

// 将 Markdown 内容转换为 HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown);
  
  return result.toString();
}

// 根据 slug 获取单个 markdown 文章
export function getMarkdownArticleBySlug(slug: string): Article | null {
  const categories = ['reading', 'life', 'tech', 'collection'];
  
  for (const category of categories) {
    const articles = getMarkdownArticles(category);
    const article = articles.find(a => a.slug === slug);
    if (article) {
      return article;
    }
  }
  
  return null;
}

