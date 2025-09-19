import { supabase } from './supabase'
import { Tables, Inserts, Updates } from './supabase'

export type Comment = Tables<'comments'>
export type CommentInsert = Inserts<'comments'>
export type CommentUpdate = Updates<'comments'>

export interface CommentWithAuthor extends Comment {
  author: {
    id: string
    name: string
    avatar_url?: string
  }
}

export class SupabaseCommentService {
  // 获取文章的所有评论
  static async getArticleComments(articleId: string): Promise<CommentWithAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  // 创建评论
  static async createComment(comment: Omit<CommentInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; comment?: Comment; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          ...comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, comment: data }
    } catch (error) {
      console.error('Error creating comment:', error)
      return { success: false, error: '创建评论失败' }
    }
  }

  // 更新评论
  static async updateComment(id: string, updates: CommentUpdate): Promise<{ success: boolean; comment?: Comment; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('comments')
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

      return { success: true, comment: data }
    } catch (error) {
      console.error('Error updating comment:', error)
      return { success: false, error: '更新评论失败' }
    }
  }

  // 删除评论
  static async deleteComment(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting comment:', error)
      return { success: false, error: '删除评论失败' }
    }
  }
}
