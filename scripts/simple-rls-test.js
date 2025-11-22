// 简单的 RLS 测试
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 手动加载 .env.local 文件
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function testSimpleRLS() {
  console.log('🔍 简单 RLS 测试...\n');

  try {
    // 测试 1: 查询所有文章（应该被 RLS 阻止）
    console.log('1️⃣ 测试匿名用户查询所有文章...');
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*');

    if (allError) {
      console.log('✅ 匿名用户被 RLS 阻止（符合预期）:', allError.message);
    } else {
      console.log(`❌ 匿名用户成功查询到 ${allArticles.length} 篇文章（不符合预期）`);
      console.log('这说明 RLS 策略没有正确配置！');
    }

    // 测试 2: 查询已发布文章（应该成功）
    console.log('\n2️⃣ 测试匿名用户查询已发布文章...');
    const { data: publishedArticles, error: publishedError } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true);

    if (publishedError) {
      console.log('❌ 匿名用户无法查询已发布文章:', publishedError.message);
    } else {
      console.log(`✅ 匿名用户成功查询到 ${publishedArticles.length} 篇已发布文章`);
    }

    // 测试 3: 尝试插入文章（应该被 RLS 阻止）
    console.log('\n3️⃣ 测试匿名用户插入文章...');
    const { data: insertData, error: insertError } = await supabase
      .from('articles')
      .insert({
        title: '测试文章',
        content: '测试内容',
        slug: 'test-article',
        published: true
      });

    if (insertError) {
      console.log('✅ 匿名用户被 RLS 阻止插入文章（符合预期）:', insertError.message);
    } else {
      console.log('❌ 匿名用户成功插入文章（不符合预期）');
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

testSimpleRLS();


