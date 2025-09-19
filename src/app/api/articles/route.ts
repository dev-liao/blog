import { NextRequest, NextResponse } from 'next/server'
import { SupabaseArticleService } from '@/lib/supabaseArticles'
import { createClient } from '@supabase/supabase-js'

// 创建服务端 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let articles

    if (search) {
      articles = await SupabaseArticleService.searchArticles(search)
    } else if (tag) {
      articles = await SupabaseArticleService.getArticlesByTag(tag)
    } else {
      articles = await SupabaseArticleService.getPublishedArticles()
    }

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, slug, author_id, tags, published, featured_image } = body

    // 验证用户身份
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    // 从 Authorization header 中提取 token
    const token = authHeader.replace('Bearer ', '')
    
    // 验证 token 并获取用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // 验证 author_id 是否与当前用户匹配
    if (author_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: author_id does not match current user' },
        { status: 403 }
      )
    }

    // 使用服务端客户端创建文章（绕过 RLS）
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        excerpt,
        slug,
        author_id,
        tags: tags || [],
        published: published || false,
        featured_image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating article:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ article: data })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}