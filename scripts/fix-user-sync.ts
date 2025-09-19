import { supabase } from '../src/lib/supabase'

// 修复用户同步问题的脚本
async function fixUserSync() {
  console.log('开始修复用户同步问题...')
  
  try {
    // 1. 获取所有认证用户
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('获取认证用户失败:', authError.message)
      return
    }

    console.log(`找到 ${users.length} 个认证用户`)

    // 2. 为每个认证用户在 users 表中创建记录
    for (const authUser of users) {
      console.log(`处理用户: ${authUser.email}`)
      
      // 检查用户是否已存在于 users 表中
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single()

      if (existingUser) {
        console.log(`用户 ${authUser.email} 已存在于 users 表中`)
        continue
      }

      // 创建用户记录
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
          avatar_url: authUser.user_metadata?.avatar_url || null,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at
        })
        .select()
        .single()

      if (userError) {
        console.error(`创建用户记录失败 ${authUser.email}:`, userError.message)
      } else {
        console.log(`✅ 成功创建用户记录: ${authUser.email}`)
      }
    }

    // 3. 验证修复结果
    const { data: allUsers } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('\n📋 当前 users 表中的所有用户:')
    allUsers?.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - ID: ${user.id}`)
    })

    console.log('\n✅ 用户同步修复完成!')
    
  } catch (error) {
    console.error('修复过程中发生错误:', error)
  }
}

// 运行脚本
if (require.main === module) {
  fixUserSync()
}

export { fixUserSync }
