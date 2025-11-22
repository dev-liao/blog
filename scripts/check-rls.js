const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aogdflljmsvnosbszexi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ2RmbGxqbXN2bm9zYnN6ZXhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDEzNSwiZXhwIjoyMDczODYwMTM1fQ.MnbJnZJAegdxalCGQk4bru2_-aNF-l73iRRogAkU_nk';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkRLSPolicies() {
  try {
    console.log('🔍 检查 RLS 策略...');
    
    // 使用 SQL 查询检查策略
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'articles'
        ORDER BY policyname;
      `
    });
    
    if (error) {
      console.error('❌ 获取策略失败:', error);
      return;
    }
    
    console.log('📊 文章表策略数量:', data?.length || 0);
    
    if (data && data.length > 0) {
      data.forEach((policy, index) => {
        console.log(`${index + 1}. ${policy.policyname}`);
        console.log(`   命令: ${policy.cmd}`);
        console.log(`   条件: ${policy.qual || '无'}`);
        console.log('   ---');
      });
    } else {
      console.log('❌ 没有找到任何 RLS 策略');
    }
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  }
}

checkRLSPolicies();


