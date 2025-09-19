# 部署指南 - Next.js 博客 v1.4.0

## 🚀 部署方案

### 推荐：Vercel + Supabase
- **前端**: Vercel (免费)
- **后端**: Supabase (免费)
- **域名**: 自动分配 + 自定义域名支持

## 📋 部署步骤

### 1. 准备代码仓库

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit - v1.4.0 with Supabase integration"

# 添加远程仓库
git remote add origin https://github.com/yourusername/your-repo-name.git

# 推送到 GitHub
git push -u origin main
```

### 2. 配置 Supabase

#### 2.1 执行数据库迁移
在 Supabase SQL 编辑器中执行以下 SQL：

```sql
-- 创建用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 创建索引
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_article_id ON favorites(article_id);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view own articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### 2.2 配置认证设置
1. 在 Supabase 项目仪表板中，点击 "Authentication"
2. 选择 "Settings" 选项卡
3. 在 "Site URL" 中添加您的 Vercel 域名
4. 在 "Redirect URLs" 中添加 `https://your-domain.vercel.app/auth/callback`

### 3. 部署到 Vercel

#### 3.1 通过 Vercel 网站部署
1. 访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择您的 GitHub 仓库
5. 选择 Next.js 框架
6. 配置环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://aogdflljmsvnosbszexi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ2RmbGxqbXN2bm9zYnN6ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODQxMzUsImV4cCI6MjA3Mzg2MDEzNX0.DqOddtlqRPfzSEHELzgvUdlD8hY18gzJo28UVi-K4hE
   ```
7. 点击 "Deploy"

#### 3.2 通过 Vercel CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

### 4. 配置自定义域名（可选）

1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加您的自定义域名
3. 配置 DNS 记录
4. 等待 SSL 证书自动配置

## 🔧 环境变量配置

### 开发环境 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://aogdflljmsvnosbszexi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ2RmbGxqbXN2bm9zYnN6ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODQxMzUsImV4cCI6MjA3Mzg2MDEzNX0.DqOddtlqRPfzSEHELzgvUdlD8hY18gzJo28UVi-K4hE
```

### 生产环境 (Vercel)
在 Vercel 项目设置中添加相同的环境变量。

## 📊 监控和维护

### 1. 性能监控
- Vercel 提供内置的性能监控
- Supabase 提供数据库性能指标

### 2. 日志查看
- Vercel: 项目仪表板 → Functions 标签
- Supabase: 项目仪表板 → Logs

### 3. 数据库备份
- Supabase 自动备份
- 可手动导出数据

## 🚨 故障排除

### 常见问题

1. **环境变量未生效**
   - 检查 Vercel 环境变量配置
   - 重新部署项目

2. **数据库连接失败**
   - 检查 Supabase 项目状态
   - 验证 API 密钥

3. **认证问题**
   - 检查 Supabase Auth 设置
   - 验证重定向 URL 配置

4. **构建失败**
   - 检查代码语法错误
   - 查看 Vercel 构建日志

## 📈 扩展方案

### 1. 升级到付费计划
- **Vercel Pro**: $20/月，更多功能和资源
- **Supabase Pro**: $25/月，更多数据库存储和功能

### 2. 添加 CDN
- Vercel 内置全球 CDN
- 可配置自定义 CDN

### 3. 数据库优化
- 添加更多索引
- 优化查询性能
- 配置缓存策略

## 🎯 部署检查清单

- [ ] 代码推送到 GitHub
- [ ] Supabase 数据库迁移完成
- [ ] Supabase Auth 配置完成
- [ ] Vercel 项目创建
- [ ] 环境变量配置
- [ ] 域名配置（可选）
- [ ] 功能测试完成
- [ ] 性能监控配置

---

**部署完成后，您的博客将可以通过 Vercel 提供的域名访问！**
