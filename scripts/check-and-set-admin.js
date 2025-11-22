// 检查和设置管理员角色脚本
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnvFile();

console.log('环境变量检查:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置' : '未设置');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 环境变量未正确加载');
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAndSetAdmin() {
  try {
    console.log('🔍 检查所有用户...');
    
    // 获取所有用户
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('❌ 获取用户失败:', usersError);
      return;
    }
    
    console.log(`📊 总用户数: ${users?.length || 0}`);
    
    if (users && users.length > 0) {
      console.log('\n👥 用户列表:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   邮箱: ${user.email}`);
        console.log(`   角色: ${user.role || '未设置'}`);
        console.log(`   创建时间: ${user.created_at}`);
        console.log('   ---');
      });
      
      // 检查是否有管理员
      const admins = users.filter(u => u.role === 'admin');
      console.log(`\n👑 管理员数量: ${admins.length}`);
      
      if (admins.length === 0) {
        console.log('⚠️  没有找到管理员，将设置第一个用户为管理员...');
        
        const firstUser = users[0];
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', firstUser.id);
        
        if (updateError) {
          console.error('❌ 设置管理员失败:', updateError);
        } else {
          console.log(`✅ 已将用户 ${firstUser.email} 设置为管理员`);
        }
      } else {
        console.log('✅ 已找到管理员用户');
      }
    } else {
      console.log('❌ 没有找到任何用户');
    }
    
    // 检查文章
    console.log('\n📝 检查文章...');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*');
    
    if (articlesError) {
      console.error('❌ 获取文章失败:', articlesError);
    } else {
      console.log(`📊 文章数量: ${articles?.length || 0}`);
      if (articles && articles.length > 0) {
        articles.forEach((article, index) => {
          console.log(`${index + 1}. ${article.title} (${article.slug}) - ${article.published ? '已发布' : '草稿'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  }
}

checkAndSetAdmin();