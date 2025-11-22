// 测试 RLS 策略脚本
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

// 加载环境变量
loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.log('请确保 .env.local 文件包含：');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// 创建客户端
const anonClient = createClient(supabaseUrl, anonKey);
const serviceClient = createClient(supabaseUrl, serviceKey);

async function testRLSPolicies() {
  console.log('🔍 测试 RLS 策略...\n');

  try {
    // 1. 测试匿名用户查询已发布文章
    console.log('1️⃣ 测试匿名用户查询已发布文章...');
    const { data: publishedArticles, error: publishedError } = await anonClient
      .from('articles')
      .select('id, title, slug, published')
      .eq('published', true);

    if (publishedError) {
      console.error('❌ 匿名用户无法查询已发布文章:', publishedError.message);
    } else {
      console.log(`✅ 匿名用户成功查询到 ${publishedArticles.length} 篇已发布文章`);
      publishedArticles.forEach(article => {
        console.log(`   - ${article.title} (${article.slug})`);
      });
    }

    // 2. 测试匿名用户查询所有文章（应该失败）
    console.log('\n2️⃣ 测试匿名用户查询所有文章（应该失败）...');
    const { data: allArticles, error: allError } = await anonClient
      .from('articles')
      .select('id, title, slug, published');

    if (allError) {
      console.log('✅ 匿名用户无法查询所有文章（符合预期）:', allError.message);
    } else {
      console.log(`⚠️ 匿名用户意外成功查询到 ${allArticles.length} 篇文章`);
    }

    // 3. 测试服务端客户端查询所有文章
    console.log('\n3️⃣ 测试服务端客户端查询所有文章...');
    const { data: serviceArticles, error: serviceError } = await serviceClient
      .from('articles')
      .select('id, title, slug, published')
      .order('created_at', { ascending: false });

    if (serviceError) {
      console.error('❌ 服务端客户端查询失败:', serviceError.message);
    } else {
      console.log(`✅ 服务端客户端成功查询到 ${serviceArticles.length} 篇文章`);
      serviceArticles.forEach(article => {
        console.log(`   - ${article.title} (${article.slug}) - ${article.published ? '已发布' : '草稿'}`);
      });
    }

    // 4. 测试用户表查询
    console.log('\n4️⃣ 测试用户表查询...');
    const { data: users, error: usersError } = await anonClient
      .from('users')
      .select('id, email, role')
      .limit(5);

    if (usersError) {
      console.error('❌ 查询用户失败:', usersError.message);
    } else {
      console.log(`✅ 成功查询到 ${users.length} 个用户`);
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

    // 5. 总结
    console.log('\n📊 测试总结:');
    console.log('- 匿名用户应该只能查看已发布的文章');
    console.log('- 管理员用户应该能查看所有文章');
    console.log('- 服务端客户端应该能绕过 RLS 限制');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

testRLSPolicies();


