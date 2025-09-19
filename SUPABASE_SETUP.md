# Supabase 配置说明

## 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 创建新项目
3. 选择组织或创建新组织
4. 填写项目名称和数据库密码
5. 选择地区（建议选择离您最近的地区）
6. 点击 "Create new project"

## 2. 获取项目配置

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 选择 "API" 选项卡
3. 复制以下信息：
   - Project URL
   - Project API keys -> anon public

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 数据库表结构

在 Supabase 的 SQL 编辑器中执行以下 SQL 创建表：

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
-- 用户可以查看所有已发布的文章
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

-- 用户可以查看自己的文章
CREATE POLICY "Users can view own articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

-- 用户可以创建文章
CREATE POLICY "Users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 用户可以更新自己的文章
CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- 用户可以删除自己的文章
CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

-- 用户可以查看所有评论
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- 用户可以创建评论
CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的评论
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- 用户可以查看自己的收藏
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以创建收藏
CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的收藏
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

## 5. 配置认证

1. 在 Supabase 项目仪表板中，点击 "Authentication"
2. 选择 "Settings" 选项卡
3. 在 "Site URL" 中填入 `http://localhost:3000`
4. 在 "Redirect URLs" 中添加 `http://localhost:3000/auth/callback`

## 6. 启动项目

```bash
npm run dev
```

访问 `http://localhost:3000` 开始使用！
