import { NextRequest, NextResponse } from 'next/server'
import { SupabaseFavoriteService } from '@/lib/supabaseFavorites'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const favorites = await SupabaseFavoriteService.getUserFavorites(userId)
    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, articleId } = body

    if (!userId || !articleId) {
      return NextResponse.json(
        { error: 'User ID and Article ID are required' },
        { status: 400 }
      )
    }

    const result = await SupabaseFavoriteService.addFavorite(userId, articleId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, articleId } = body

    if (!userId || !articleId) {
      return NextResponse.json(
        { error: 'User ID and Article ID are required' },
        { status: 400 }
      )
    }

    const result = await SupabaseFavoriteService.removeFavorite(userId, articleId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
