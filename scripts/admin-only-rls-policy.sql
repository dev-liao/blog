-- 管理员专用 RLS 策略配置
-- 只有管理员用户可以创建和管理文章，普通用户只能收藏文章

-- ===========================================
-- 1. 删除现有的 articles 表策略
-- ===========================================

DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Users can view own articles" ON articles;
DROP POLICY IF EXISTS "Users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;

-- ===========================================
-- 2. 创建新的 articles 表策略
-- ===========================================

-- 任何人都可以查看已发布的文章
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

-- 只有管理员可以查看所有文章（包括草稿）
CREATE POLICY "Admins can view all articles" ON articles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 只有管理员可以创建文章
CREATE POLICY "Admins can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 只有管理员可以更新文章
CREATE POLICY "Admins can update articles" ON articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 只有管理员可以删除文章
CREATE POLICY "Admins can delete articles" ON articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ===========================================
-- 3. 更新 favorites 表策略（普通用户可以收藏）
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
-- 4. 更新 comments 表策略（普通用户可以评论）
-- ===========================================

-- 删除现有的 comments 表策略
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- 任何人都可以查看评论
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

