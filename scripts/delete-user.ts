import { supabase } from '../src/lib/supabase'

// 删除指定用户的脚本
async function deleteUser() {
  const emailToDelete = 'chn_liao@163.com'
  
  console.log(`开始删除用户: ${emailToDelete}`)
  
  try {
    // 1. 首先查看该用户是否存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailToDelete)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('查询用户失败:', checkError.message)
      return
    }

    if (!existingUser) {
      console.log(`用户 ${emailToDelete} 不存在于 users 表中`)
      return
    }

    console.log('找到用户:', existingUser)

    // 2. 删除用户记录
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', emailToDelete)

    if (deleteError) {
      console.error('删除用户失败:', deleteError.message)
      console.error('错误详情:', {
        message: deleteError.message,
        code: deleteError.code,
        details: deleteError.details,
        hint: deleteError.hint
      })
      return
    }

    console.log(`✅ 成功删除用户: ${emailToDelete}`)

    // 3. 验证删除结果
    const { data: verifyUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailToDelete)
      .single()

    if (verifyUser) {
      console.log('❌ 用户删除失败，仍然存在')
    } else {
      console.log('✅ 用户删除成功，已不存在')
    }

    // 4. 显示剩余用户
    const { data: remainingUsers } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: false })

    console.log('\n📋 剩余用户列表:')
    remainingUsers?.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - ID: ${user.id}`)
    })

  } catch (error) {
    console.error('删除过程中发生错误:', error)
  }
}

// 运行脚本
if (require.main === module) {
  deleteUser()
}

export { deleteUser }
