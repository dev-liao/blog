import { supabase } from './supabase'
import { Tables, Inserts } from './supabase'
import { ArticleWithAuthor } from './supabaseArticles'

export type Favorite = Tables<'favorites'>
export type FavoriteInsert = Inserts<'favorites'>

export class SupabaseFavoriteService {
  // 获取用户的收藏文章
  static async getUserFavorites(userId: string): Promise<ArticleWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          article:articles(
            *,
            author:users(id, name, avatar_url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching favorites:', error)
        return []
      }

      return data?.map(item => item.article).filter(Boolean) || []
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return []
    }
  }

  // 检查文章是否被用户收藏
  static async isArticleFavorited(userId: string, articleId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('article_id', articleId)
        .single()

      if (error) {
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return false
    }
  }

  // 添加收藏
  static async addFavorite(userId: string, articleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          article_id: articleId,
          created_at: new Date().toISOString()
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding favorite:', error)
      return { success: false, error: '添加收藏失败' }
    }
  }

  // 移除收藏
  static async removeFavorite(userId: string, articleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error removing favorite:', error)
      return { success: false, error: '移除收藏失败' }
    }
  }

  // 切换收藏状态
  static async toggleFavorite(userId: string, articleId: string): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
    try {
      const isFavorited = await this.isArticleFavorited(userId, articleId)
      
      if (isFavorited) {
        const result = await this.removeFavorite(userId, articleId)
        return { ...result, isFavorited: false }
      } else {
        const result = await this.addFavorite(userId, articleId)
        return { ...result, isFavorited: true }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return { success: false, isFavorited: false, error: '切换收藏状态失败' }
    }
  }
}
