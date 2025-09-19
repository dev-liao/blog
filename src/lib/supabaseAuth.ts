import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar_url?: string
  role?: string
}

export class SupabaseAuthService {
  // 获取当前用户
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // 获取用户详细信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError || !userData) {
        return null
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        role: userData.role || 'user'
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // 注册用户
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // 使用 Supabase Auth 注册
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: '注册失败' }
      }

      // 创建用户记录
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name
        })

      if (userError) {
        return { success: false, error: '创建用户记录失败' }
      }

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: '注册过程中发生错误' }
    }
  }

  // 登录用户
  static async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: '登录失败' }
      }

      // 获取用户详细信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError || !userData) {
        return { success: false, error: '获取用户信息失败' }
      }

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar_url,
          role: userData.role || 'user'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: '登录过程中发生错误' }
    }
  }

  // 登出用户
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: '登出过程中发生错误' }
    }
  }

  // 监听认证状态变化
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}
