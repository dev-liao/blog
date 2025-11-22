// 详细的 RLS 调试脚本
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, anonKey);
const serviceClient = createClient(supabaseUrl, serviceKey);

async function debugRLSDetailed() {
  console.log('🔍 详细 RLS 调试...\n');

  try {
    // 1. 测试匿名用户查询所有文章
    console.log('1️⃣ 匿名用户查询所有文章:');
    const { data: allArticles, error: allError } = await anonClient
      .from('articles')
      .select('id, title, slug, published');
    
    console.log(`   结果: ${allError ? '❌ 被阻止' : '✅ 成功'}`);
    if (allError) {
      console.log(`   错误: ${allError.message}`);
    } else {
      console.log(`   数据: ${JSON.stringify(allArticles, null, 2)}`);
    }

    // 2. 测试匿名用户查询已发布文章
    console.log('\n2️⃣ 匿名用户查询已发布文章:');
    const { data: publishedArticles, error: publishedError } = await anonClient
      .from('articles')
      .select('id, title, slug, published')
      .eq('published', true);
    
    console.log(`   结果: ${publishedError ? '❌ 被阻止' : '✅ 成功'}`);
    if (publishedError) {
      console.log(`   错误: ${publishedError.message}`);
    } else {
      console.log(`   数据: ${JSON.stringify(publishedArticles, null, 2)}`);
    }

    // 3. 测试匿名用户查询草稿文章
    console.log('\n3️⃣ 匿名用户查询草稿文章:');
    const { data: draftArticles, error: draftError } = await anonClient
      .from('articles')
      .select('id, title, slug, published')
      .eq('published', false);
    
    console.log(`   结果: ${draftError ? '✅ 被阻止（符合预期）' : '❌ 成功（不符合预期）'}`);
    if (draftError) {
      console.log(`   错误: ${draftError.message}`);
    } else {
      console.log(`   数据: ${JSON.stringify(draftArticles, null, 2)}`);
    }

    // 4. 测试服务端客户端查询
    console.log('\n4️⃣ 服务端客户端查询所有文章:');
    const { data: serviceArticles, error: serviceError } = await serviceClient
      .from('articles')
      .select('id, title, slug, published');
    
    console.log(`   结果: ${serviceError ? '❌ 失败' : '✅ 成功'}`);
    if (serviceError) {
      console.log(`   错误: ${serviceError.message}`);
    } else {
      console.log(`   数据: ${JSON.stringify(serviceArticles, null, 2)}`);
    }

    // 5. 分析问题
    console.log('\n📊 问题分析:');
    
    if (!allError && !publishedError) {
      console.log('❌ 问题：匿名用户能查询所有文章，说明 RLS 策略没有生效');
      console.log('   可能原因：');
      console.log('   1. articles 表的 RLS 没有启用');
      console.log('   2. 策略没有正确保存');
      console.log('   3. 策略配置有误');
    } else if (allError && !publishedError) {
      console.log('✅ 正确：匿名用户被阻止查询所有文章，但可以查询已发布文章');
    } else if (allError && publishedError) {
      console.log('❌ 问题：匿名用户连已发布文章都无法查询');
    }

  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
  }
}

debugRLSDetailed();


