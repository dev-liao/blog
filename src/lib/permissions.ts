import { AuthUser } from './supabaseAuth'

// 权限检查工具
export class PermissionService {
  // 检查用户是否为管理员
  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin'
  }

  // 检查用户是否为普通用户
  static isUser(user: AuthUser | null): boolean {
    return user?.role === 'user' || !user?.role
  }

  // 检查用户是否可以访问管理后台
  static canAccessAdmin(user: AuthUser | null): boolean {
    return this.isAdmin(user)
  }

  // 检查用户是否可以编辑文章
  static canEditArticle(user: AuthUser | null, articleAuthorId?: string): boolean {
    if (!user) return false
    return this.isAdmin(user) || user.id === articleAuthorId
  }

  // 检查用户是否可以删除文章
  static canDeleteArticle(user: AuthUser | null, articleAuthorId?: string): boolean {
    if (!user) return false
    return this.isAdmin(user) || user.id === articleAuthorId
  }

  // 检查用户是否可以管理用户
  static canManageUsers(user: AuthUser | null): boolean {
    return this.isAdmin(user)
  }
}

// 导出常用的权限检查函数
export const isAdmin = PermissionService.isAdmin
export const isUser = PermissionService.isUser
export const canAccessAdmin = PermissionService.canAccessAdmin
export const canEditArticle = PermissionService.canEditArticle
export const canDeleteArticle = PermissionService.canDeleteArticle
export const canManageUsers = PermissionService.canManageUsers
