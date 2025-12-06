import 'server-only';

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
// 动态获取 content 目录路径，避免在模块加载时计算
function getContentDir(): string {
  try {
    // 获取项目根目录（在构建时和运行时都正确）
    const projectRoot = process.cwd();
    const contentPath = path.join(projectRoot, 'content');
    
    return contentPath;
  } catch (error) {
    console.error('Error resolving content directory:', error);
    // 返回默认路径
    return path.join(process.cwd(), 'content');
  }
}

// 检查是否为服务端环境
function isServerSide(): boolean {
  return typeof window === 'undefined' && typeof process !== 'undefined' && !!process.cwd;
}

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
  // 只在服务端执行文件系统操作
  if (!isServerSide()) {
    console.warn('getMarkdownArticles called on client side, returning empty array');
    return [];
  }

  try {
    const contentDir = getContentDir();
    const categoryDir = path.join(contentDir, category);
    
    // 如果目录不存在，静默返回空数组（避免构建错误）
    if (!fs.existsSync(categoryDir)) {
      console.warn(`Category directory not found: ${categoryDir}`);
      return [];
    }
    
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
      try {
        const dateA = new Date(a.date.replace('年', '-').replace('月', '-').replace('日', ''));
        const dateB = new Date(b.date.replace('年', '-').replace('月', '-').replace('日', ''));
        return dateB.getTime() - dateA.getTime();
      } catch {
        // 如果日期解析失败，保持原有顺序
        return 0;
      }
    });
    
    return articles;
  } catch (error) {
    // 在构建时遇到错误时，返回空数组而不是抛出错误
    console.error(`Error reading markdown articles from ${category}:`, error);
    return [];
  }
}

// 获取所有分类的 markdown 文章
export function getAllMarkdownArticles(): Article[] {
  // 只在服务端执行
  if (!isServerSide()) {
    return [];
  }

  const categories = ['reading', 'life', 'tech', 'collection'];
  const allArticles: Article[] = [];
  
  try {
    for (const category of categories) {
      const articles = getMarkdownArticles(category);
      allArticles.push(...articles);
    }
  } catch (error) {
    console.error('Error getting all markdown articles:', error);
  }
  
  return allArticles;
}

// 根据分类获取 markdown 文章
export function getMarkdownArticlesByCategory(category: string): Article[] {
  // 只在服务端执行
  if (!isServerSide()) {
    return [];
  }

  const categoryMap: Record<string, string> = {
    '读书': 'reading',
    '生活': 'life',
    '技术': 'tech',
    '收藏': 'collection',
  };
  
  try {
    const dirName = categoryMap[category] || category.toLowerCase();
    return getMarkdownArticles(dirName);
  } catch (error) {
    console.error(`Error getting markdown articles for category ${category}:`, error);
    return [];
  }
}

// 将 Markdown 内容转换为 HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(markdown);
    
    let html = result.toString();
    
    // remark-html 会将图片转换为 <p><img src="..." alt="..."></p>
    // 我们需要确保所有 img 标签都有正确的属性
    html = html.replace(
      /<img([^>]*?)>/gi,
      (match: string, attrs: string) => {
        // 提取 src 属性
        const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
        if (!srcMatch) {
          return match; // 如果没有 src，返回原样
        }
        
        let src = srcMatch[1];
        const originalSrc = src; // 保存原始 URL 用于回退
        
        // 如果是 Gitee 图片，使用代理 API 绕过 CORS 和 Referer 限制
        if (src.includes('gitee.com')) {
          // 确保 URL 正确编码（只编码一次）
          const encodedUrl = encodeURIComponent(src);
          src = `/api/image-proxy?url=${encodedUrl}`;
        }
        
        // 转义 src 中的特殊字符（虽然 URL 通常不需要，但为了安全）
        const safeSrc = src.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const safeOriginalSrc = originalSrc.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        
        let newAttrs = attrs;
        
        // 确保有 alt 属性
        if (!/alt=["']/i.test(newAttrs)) {
          // 尝试从现有属性中提取 alt 文本
          const altMatch = match.match(/alt=["']([^"']*)["']/i);
          const alt = altMatch ? altMatch[1] : '';
          const safeAlt = alt.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          newAttrs = `alt="${safeAlt}" ${newAttrs}`;
        }
        
        // 添加 loading="lazy"
        if (!/loading=["']/i.test(newAttrs)) {
          newAttrs = `${newAttrs} loading="lazy"`;
        }
        
        // 如果是 Gitee 图片，添加 data-original-url 属性用于回退，并设置 referrerPolicy
        if (originalSrc.includes('gitee.com')) {
          if (!/data-original-url=["']/i.test(newAttrs)) {
            newAttrs = `${newAttrs} data-original-url="${safeOriginalSrc}"`;
          }
          if (!/referrerpolicy=["']/i.test(newAttrs)) {
            newAttrs = `${newAttrs} referrerPolicy="no-referrer"`;
          }
        }
        
        // 添加 class
        if (!/class=["']/i.test(newAttrs)) {
          newAttrs = `${newAttrs} class="article-image"`;
        } else {
          newAttrs = newAttrs.replace(/class=["']([^"']*)["']/i, (m: string, classes: string) => {
            if (!classes.includes('article-image')) {
              return `class="${classes} article-image"`;
            }
            return m;
          });
        }
        
        // 确保 src 属性是最新的（使用转义后的 URL）
        newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, `src="${safeSrc}"`);
        
        return `<img ${newAttrs.trim()}>`;
      }
    );
    
    // 为表格添加可滚动的包装容器
    // 使用更健壮的方法处理表格（包括嵌套情况）
    let tableIndex = 0;
    html = html.replace(
      /<table([^>]*?)>([\s\S]*?)<\/table>/gi,
      (match: string, tableAttrs: string, tableContent: string) => {
        // 检查是否已经在包装容器内
        if (match.includes('table-wrapper')) {
          return match;
        }
        
        // 添加包装容器和表格类名
        const wrapperClass = 'table-wrapper';
        let tableClass = tableAttrs.trim();
        
        // 处理 class 属性
        if (tableClass.includes('class=')) {
          tableClass = tableClass.replace(/class=["']([^"']*)["']/i, (m: string, classes: string) => {
            const newClasses = classes.includes('article-table') 
              ? classes 
              : `${classes} article-table`;
            return `class="${newClasses}"`;
          });
        } else {
          tableClass = `${tableClass} class="article-table"`.trim();
        }
        
        // 如果 tableClass 为空，确保有空格
        if (tableClass && !tableClass.startsWith(' ')) {
          tableClass = ' ' + tableClass;
        }
        
        tableIndex++;
        return `<div class="${wrapperClass}"><table${tableClass}>${tableContent}</table></div>`;
      }
    );
    
    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    // 如果转换失败，返回原始 markdown（转义 HTML）
    return markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// 根据 slug 获取单个 markdown 文章
export function getMarkdownArticleBySlug(slug: string): Article | null {
  // 只在服务端执行
  if (!isServerSide()) {
    return null;
  }

  try {
    const categories = ['reading', 'life', 'tech', 'collection'];
    
    for (const category of categories) {
      const articles = getMarkdownArticles(category);
      const article = articles.find(a => a.slug === slug);
      if (article) {
        return article;
      }
    }
  } catch (error) {
    console.error(`Error getting markdown article by slug ${slug}:`, error);
  }
  
  return null;
}

