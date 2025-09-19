-- 删除 chn_liao@163.com 用户的 SQL 脚本
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 首先查看该用户是否存在
SELECT * FROM users WHERE email = 'chn_liao@163.com';

-- 2. 删除该用户记录
DELETE FROM users WHERE email = 'chn_liao@163.com';

-- 3. 验证删除结果
SELECT * FROM users WHERE email = 'chn_liao@163.com';

-- 4. 查看所有剩余用户
SELECT id, email, name, created_at FROM users ORDER BY created_at DESC;
