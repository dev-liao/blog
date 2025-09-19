import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/lib/articles';

// 模拟数据库存储
let articlesDatabase: Article[] = [];

// 获取用户的所有文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    const userArticles = articlesDatabase.filter(article => article.author === userId);
    
    return NextResponse.json({
      success: true,
      data: userArticles
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取用户文章失败' },
      { status: 500 }
    );
  }
}

