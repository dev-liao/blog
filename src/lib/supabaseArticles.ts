import { supabase } from './supabase'
import { Tables, Inserts, Updates } from './supabase'

export type Article = Tables<'articles'>
export type ArticleInsert = Inserts<'articles'>
export type ArticleUpdate = Updates<'articles'>

export interface ArticleWithAuthor extends Article {
  author: {
    id: string
    name: string
    avatar_url?: string
  }
}

export class SupabaseArticleService {
  // 获取所有已发布的文章
  static async getPublishedArticles(): Promise<ArticleWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching articles:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching articles:', error)
      return []
    }
  }

  // 获取用户的所有文章
  static async getUserArticles(userId: string): Promise<ArticleWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user articles:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user articles:', error)
      return []
    }
  }

  // 根据 slug 获取文章
  static async getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) {
        console.error('Error fetching article:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching article:', error)
      return null
    }
  }

  // 创建文章
  static async createArticle(article: Omit<ArticleInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; article?: Article; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, article: data }
    } catch (error) {
      console.error('Error creating article:', error)
      return { success: false, error: '创建文章失败' }
    }
  }

  // 更新文章
  static async updateArticle(id: string, updates: ArticleUpdate): Promise<{ success: boolean; article?: Article; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, article: data }
    } catch (error) {
      console.error('Error updating article:', error)
      return { success: false, error: '更新文章失败' }
    }
  }

  // 删除文章
  static async deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting article:', error)
      return { success: false, error: '删除文章失败' }
    }
  }

  // 搜索文章
  static async searchArticles(query: string): Promise<ArticleWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching articles:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error searching articles:', error)
      return []
    }
  }

  // 根据标签获取文章
  static async getArticlesByTag(tag: string): Promise<ArticleWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('published', true)
        .contains('tags', [tag])
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching articles by tag:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching articles by tag:', error)
      return []
    }
  }

  // 获取所有标签
  static async getAllTags(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('published', true)

      if (error) {
        console.error('Error fetching tags:', error)
        return []
      }

      const allTags = data?.flatMap(article => article.tags || []) || []
      return [...new Set(allTags)]
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }
}
