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

      // 如果用户不存在于 users 表中，自动创建
      if (userError || !userData) {
        console.log('用户不存在于 users 表中，正在创建...')
        
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || null,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at
          })
          .select()
          .single()

        if (createError) {
          console.error('创建用户记录失败:', createError.message)
          return null
        }

        return {
          id: newUserData.id,
          email: newUserData.email,
          name: newUserData.name,
          avatar_url: newUserData.avatar_url
        }
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url
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

      // 获取用户详细信息，如果不存在则自动创建
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      let finalUserData = userData

      // 如果用户不存在于 users 表中，自动创建
      if (userError || !userData) {
        console.log('用户不存在于 users 表中，正在创建...')
        
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url || null,
            created_at: data.user.created_at,
            updated_at: data.user.updated_at || data.user.created_at
          })
          .select()
          .single()

        if (createError) {
          console.error('创建用户记录失败:', createError.message)
          return { success: false, error: '创建用户记录失败' }
        }

        finalUserData = newUserData
      }

      return {
        success: true,
        user: {
          id: finalUserData.id,
          email: finalUserData.email,
          name: finalUserData.name,
          avatar_url: finalUserData.avatar_url
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
