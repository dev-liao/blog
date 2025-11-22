// RLS 诊断脚本
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

async function diagnoseRLS() {
  console.log('🔍 RLS 诊断报告...\n');

  try {
    // 1. 检查匿名用户权限
    console.log('1️⃣ 匿名用户权限测试:');
    
    // 测试查询所有文章
    const { data: allArticles, error: allError } = await anonClient
      .from('articles')
      .select('*');
    
    if (allError) {
      console.log('   ✅ 匿名用户无法查询所有文章（符合预期）');
      console.log(`   📝 错误信息: ${allError.message}`);
    } else {
      console.log('   ❌ 匿名用户能查询所有文章（不符合预期）');
      console.log(`   📝 查询到 ${allArticles.length} 篇文章`);
    }

    // 测试查询已发布文章
    const { data: publishedArticles, error: publishedError } = await anonClient
      .from('articles')
      .select('*')
      .eq('published', true);
    
    if (publishedError) {
      console.log('   ❌ 匿名用户无法查询已发布文章（不符合预期）');
      console.log(`   📝 错误信息: ${publishedError.message}`);
    } else {
      console.log('   ✅ 匿名用户能查询已发布文章（符合预期）');
      console.log(`   📝 查询到 ${publishedArticles.length} 篇已发布文章`);
    }

    // 2. 检查服务端客户端权限
    console.log('\n2️⃣ 服务端客户端权限测试:');
    
    const { data: serviceArticles, error: serviceError } = await serviceClient
      .from('articles')
      .select('*');
    
    if (serviceError) {
      console.log('   ❌ 服务端客户端无法查询文章');
      console.log(`   📝 错误信息: ${serviceError.message}`);
    } else {
      console.log('   ✅ 服务端客户端能查询所有文章（符合预期）');
      console.log(`   📝 查询到 ${serviceArticles.length} 篇文章`);
    }

    // 3. 检查用户表权限
    console.log('\n3️⃣ 用户表权限测试:');
    
    const { data: users, error: usersError } = await anonClient
      .from('users')
      .select('id, email, role')
      .limit(3);
    
    if (usersError) {
      console.log('   ❌ 匿名用户无法查询用户表');
      console.log(`   📝 错误信息: ${usersError.message}`);
    } else {
      console.log('   ✅ 匿名用户能查询用户表（符合预期）');
      console.log(`   📝 查询到 ${users.length} 个用户`);
    }

    // 4. 总结和建议
    console.log('\n📊 诊断总结:');
    
    if (allError) {
      console.log('✅ RLS 策略配置正确！');
      console.log('   - 匿名用户无法查询所有文章');
      console.log('   - 匿名用户可以查询已发布文章');
      console.log('   - 服务端客户端可以绕过 RLS');
    } else {
      console.log('❌ RLS 策略配置有问题！');
      console.log('   需要检查以下配置:');
      console.log('   1. 确保 articles 表启用了 RLS');
      console.log('   2. 确保有正确的 SELECT 策略');
      console.log('   3. 确保策略表达式正确');
      
      console.log('\n🔧 建议的修复步骤:');
      console.log('   1. 在 Supabase 控制台中进入 articles 表');
      console.log('   2. 点击 RLS 标签');
      console.log('   3. 确保 "Enable Row Level Security" 开关开启');
      console.log('   4. 删除所有现有策略');
      console.log('   5. 创建新的策略（见下方）');
      
      console.log('\n📝 需要创建的策略:');
      console.log('   策略1: SELECT, public, USING: published = true');
      console.log('   策略2: SELECT, authenticated, USING: EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = \'admin\')');
      console.log('   策略3: INSERT, authenticated, WITH CHECK: EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = \'admin\')');
      console.log('   策略4: UPDATE, authenticated, USING: EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = \'admin\')');
      console.log('   策略5: DELETE, authenticated, USING: EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = \'admin\')');
    }

  } catch (error) {
    console.error('❌ 诊断过程中发生错误:', error);
  }
}

diagnoseRLS();


