-- 正式 RLS 策略修复脚本
-- 解决文章查看权限问题

-- ===========================================
-- 1. 检查当前 RLS 状态
-- ===========================================

-- 查看所有表的 RLS 状态
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'articles', 'comments', 'favorites');

-- 查看当前策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===========================================
-- 2. 修复 ARTICLES 表 RLS 策略
-- ===========================================

-- 删除所有现有的 articles 表策略
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Admins can create articles" ON articles;
DROP POLICY IF EXISTS "Admins can update all articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete all articles" ON articles;
DROP POLICY IF EXISTS "Users can view own articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;

-- 创建新的 articles 表策略

-- 1. 任何人都可以查看已发布的文章
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

-- 2. 管理员可以查看所有文章（包括草稿）
CREATE POLICY "Admins can view all articles" ON articles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. 管理员可以创建文章
CREATE POLICY "Admins can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. 管理员可以更新所有文章
CREATE POLICY "Admins can update all articles" ON articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. 管理员可以删除所有文章
CREATE POLICY "Admins can delete all articles" ON articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===========================================
-- 3. 确保 USERS 表策略正确
-- ===========================================

-- 删除现有的 users 表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;

-- 创建新的 users 表策略

-- 1. 允许用户插入自己的记录（注册时）
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. 允许用户查看自己的完整资料
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 3. 允许用户更新自己的资料
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 4. 允许所有用户查看其他用户的基本信息（用于显示作者信息）
CREATE POLICY "Anyone can view user profiles" ON users
  FOR SELECT USING (true);

-- ===========================================
-- 4. 确保 COMMENTS 表策略正确
-- ===========================================

-- 删除现有的 comments 表策略
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- 创建新的 comments 表策略

-- 1. 任何人都可以查看评论
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- 2. 认证用户可以创建评论
CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. 用户可以更新自己的评论
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- 5. 确保 FAVORITES 表策略正确
-- ===========================================

-- 删除现有的 favorites 表策略
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

-- 创建新的 favorites 表策略

-- 1. 用户可以查看自己的收藏
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 2. 用户可以创建收藏
CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. 用户可以删除自己的收藏
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- 6. 验证策略配置
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

-- ===========================================
-- 7. 测试查询（可选）
-- ===========================================

-- 测试查询已发布文章（应该成功）
-- SELECT id, title, slug, published FROM articles WHERE published = true;

-- 测试查询所有文章（需要管理员权限）
-- SELECT id, title, slug, published FROM articles;


