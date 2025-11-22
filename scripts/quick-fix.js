const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aogdflljmsvnosbszexi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ2RmbGxqbXN2bm9zYnN6ZXhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDEzNSwiZXhwIjoyMDczODYwMTM1fQ.MnbJnZJAegdxalCGQk4bru2_-aNF-l73iRRogAkU_nk';

const supabase = createClient(supabaseUrl, serviceKey);

async function quickFix() {
  try {
    console.log('🔍 检查用户...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('❌ 获取用户失败:', usersError);
      return;
    }
    
    console.log('📊 总用户数:', users?.length || 0);
    
    if (users && users.length > 0) {
      const firstUser = users[0];
      console.log('👤 第一个用户:', firstUser.email, '角色:', firstUser.role);
      
      if (firstUser.role !== 'admin') {
        console.log('⚠️  设置用户为管理员...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', firstUser.id);
        
        if (updateError) {
          console.error('❌ 设置管理员失败:', updateError);
        } else {
          console.log('✅ 用户已设置为管理员');
        }
      } else {
        console.log('✅ 用户已经是管理员');
      }
    }
    
    console.log('\n📝 检查文章...');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*');
    
    if (articlesError) {
      console.error('❌ 获取文章失败:', articlesError);
    } else {
      console.log('📊 文章数量:', articles?.length || 0);
      if (articles && articles.length > 0) {
        articles.forEach((article, index) => {
          console.log(`${index + 1}. ${article.title} (${article.slug}) - ${article.published ? '已发布' : '草稿'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ 出错:', error);
  }
}

quickFix();


