import { NextRequest, NextResponse } from 'next/server'
import { SupabaseArticleService } from '@/lib/supabaseArticles'

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

    const result = await SupabaseArticleService.createArticle({
      title,
      content,
      excerpt,
      slug,
      author_id,
      tags: tags || [],
      published: published || false,
      featured_image
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ article: result.article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}