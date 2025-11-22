-- 完整的 Supabase RLS 策略配置
-- 适用于 Next.js 博客项目

-- ===========================================
-- 1. USERS 表 RLS 策略
-- ===========================================

-- 删除现有的 users 表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;

-- 允许用户插入自己的记录（注册时）
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 允许用户查看自己的完整资料
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 允许用户更新自己的资料
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 允许所有用户查看其他用户的基本信息（用于显示作者信息）
CREATE POLICY "Anyone can view user profiles" ON users
  FOR SELECT USING (true);

-- ===========================================
-- 2. ARTICLES 表 RLS 策略
-- ===========================================

-- 删除现有的 articles 表策略
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Users can view own articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;

-- 任何人都可以查看已发布的文章
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

-- 用户可以查看自己的所有文章（包括草稿）
CREATE POLICY "Users can view own articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

-- 认证用户可以创建文章
CREATE POLICY "Users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 用户可以更新自己的文章
CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- 用户可以删除自己的文章
CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

-- ===========================================
-- 3. COMMENTS 表 RLS 策略
-- ===========================================

-- 删除现有的 comments 表策略
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- 任何人都可以查看评论
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- 认证用户可以创建评论
CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的评论
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- 4. FAVORITES 表 RLS 策略
-- ===========================================

-- 删除现有的 favorites 表策略
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

-- 用户可以查看自己的收藏
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以创建收藏
CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的收藏
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- 5. 验证策略配置
-- ===========================================

-- 查看所有表的 RLS 状态
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'articles', 'comments', 'favorites');

-- 查看所有策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

