// 用户认证相关类型和工具函数

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 模拟用户数据（实际项目中应该从API获取）
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '管理员',
    avatar: '/avatars/admin.jpg',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: '普通用户',
    avatar: '/avatars/user.jpg',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// 认证工具函数
export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  // 登录
  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 简单的模拟验证
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      return { success: false, error: '邮箱或密码错误' };
    }

    // 保存到localStorage
    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return { success: true, user };
  }

  // 注册
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查邮箱是否已存在
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, error: '邮箱已被注册' };
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    // 保存到localStorage
    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  // 登出
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // 获取当前用户
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // 检查是否已登录
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // 生成模拟token
  private static generateToken(): string {
    return 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 重置密码
  static async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return { success: false, message: '邮箱不存在' };
    }

    return { success: true, message: '密码重置链接已发送到您的邮箱' };
  }

  // 更新用户资料
  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: '用户不存在' };
    }

    const updatedUser = { ...mockUsers[userIndex], ...updates, updatedAt: new Date().toISOString() };
    mockUsers[userIndex] = updatedUser;

    // 更新localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

    return { success: true, user: updatedUser };
  }
}
