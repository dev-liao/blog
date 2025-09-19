import { supabase } from '../src/lib/supabase'
import { articles } from '../src/lib/articles'

// 迁移预设文章到 Supabase
async function migrateArticles() {
  console.log('开始迁移文章数据...')
  
  try {
    // 首先创建一个默认用户（如果不存在）
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@example.com')
      .single()

    let adminUserId: string

    if (existingUser) {
      adminUserId = existingUser.id
      console.log('使用现有管理员用户')
    } else {
      // 创建默认管理员用户
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: 'admin@example.com',
          name: '管理员'
        })
        .select()
        .single()

      if (userError) {
        console.error('创建管理员用户失败:', userError)
        return
      }

      adminUserId = newUser.id
      console.log('创建了新的管理员用户')
    }

    // 迁移文章
    for (const article of articles) {
      const { error } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          slug: article.slug,
          author_id: adminUserId,
          tags: article.tags || [],
          published: true,
          featured_image: article.featuredImage,
          created_at: article.date,
          updated_at: article.date
        })

      if (error) {
        console.error(`迁移文章 "${article.title}" 失败:`, error)
      } else {
        console.log(`✓ 迁移文章: ${article.title}`)
      }
    }

    console.log('文章迁移完成！')
  } catch (error) {
    console.error('迁移过程中发生错误:', error)
  }
}

// 运行迁移
if (require.main === module) {
  migrateArticles()
}

export { migrateArticles }
