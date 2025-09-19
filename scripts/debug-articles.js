// 调试脚本：检查 Supabase 中的文章数据
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugArticles() {
  try {
    console.log('🔍 检查 Supabase 中的文章数据...\n');

    // 检查所有文章
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ 获取所有文章时出错:', allError);
      return;
    }

    console.log(`📊 总文章数: ${allArticles?.length || 0}`);
    
    if (allArticles && allArticles.length > 0) {
      console.log('\n📝 所有文章:');
      allArticles.forEach((article, index) => {
        console.log(`${index + 1}. ID: ${article.id}`);
        console.log(`   标题: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   发布状态: ${article.published ? '已发布' : '草稿'}`);
        console.log(`   创建时间: ${article.created_at}`);
        console.log('   ---');
      });
    }

    // 检查已发布的文章
    const { data: publishedArticles, error: publishedError } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (publishedError) {
      console.error('❌ 获取已发布文章时出错:', publishedError);
      return;
    }

    console.log(`\n✅ 已发布文章数: ${publishedArticles?.length || 0}`);
    
    if (publishedArticles && publishedArticles.length > 0) {
      console.log('\n📝 已发布文章:');
      publishedArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} (${article.slug})`);
      });
    } else {
      console.log('⚠️  没有已发布的文章！');
    }

    // 检查特定 slug
    const testSlug = '111';
    console.log(`\n🔍 查找 slug 为 "${testSlug}" 的文章...`);
    
    const { data: specificArticle, error: specificError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', testSlug)
      .single();

    if (specificError) {
      console.log(`❌ 没有找到 slug 为 "${testSlug}" 的文章:`, specificError.message);
    } else {
      console.log(`✅ 找到文章:`, specificArticle);
    }

  } catch (error) {
    console.error('❌ 调试过程中出错:', error);
  }
}

debugArticles();
