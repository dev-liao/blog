// 发布测试文章脚本
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function publishTestArticle() {
  console.log('📝 发布测试文章...');
  
  try {
    // 查找测试文章
    const { data: articles, error: findError } = await supabase
      .from('articles')
      .select('id, title, slug, published')
      .eq('slug', '111');

    if (findError) {
      console.error('❌ 查找文章失败:', findError);
      return;
    }

    if (!articles || articles.length === 0) {
      console.error('❌ 未找到测试文章');
      return;
    }

    const article = articles[0];
    console.log(`找到文章: ${article.title} (${article.slug}) - 当前状态: ${article.published ? '已发布' : '草稿'}`);

    // 发布文章
    const { data, error } = await supabase
      .from('articles')
      .update({ published: true })
      .eq('id', article.id)
      .select();

    if (error) {
      console.error('❌ 发布文章失败:', error);
      return;
    }

    console.log('✅ 文章发布成功!');
    console.log('更新后的文章:', data[0]);

  } catch (error) {
    console.error('❌ 发布文章时发生错误:', error);
  }
}

publishTestArticle();


