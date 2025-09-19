import { NextRequest, NextResponse } from 'next/server';
import { SupabaseArticleService } from '@/lib/supabaseArticles';

// 获取用户的所有文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    const userArticles = await SupabaseArticleService.getUserArticles(userId);
    
    return NextResponse.json({
      success: true,
      data: userArticles
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '获取用户文章失败' },
      { status: 500 }
    );
  }
}

