import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          role?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          author_id: string
          tags: string[]
          published: boolean
          featured_image?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          slug: string
          author_id: string
          tags?: string[]
          published?: boolean
          featured_image?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          author_id?: string
          tags?: string[]
          published?: boolean
          featured_image?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
