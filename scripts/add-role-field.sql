-- 为 users 表添加 role 字段的 SQL 脚本
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 添加 role 字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. 添加约束，确保 role 只能是 'user' 或 'admin'
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin'));

-- 3. 为现有用户设置默认角色
UPDATE users SET role = 'user' WHERE role IS NULL;

-- 4. 将 chn_liao@163.com 设置为管理员
UPDATE users SET role = 'admin' WHERE email = 'chn_liao@163.com';

-- 5. 验证更新结果
SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;

