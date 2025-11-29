import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 缓存1小时

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing image URL parameter' },
      { status: 400 }
    );
  }

  try {
    // 解码 URL（可能被编码了两次）
    try {
      imageUrl = decodeURIComponent(imageUrl);
    } catch {
      // 如果解码失败，使用原始 URL
    }

    // 验证 URL 是否来自允许的域名
    const allowedDomains = ['gitee.com', 'github.com'];
    const urlObj = new URL(imageUrl);
    
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 403 }
      );
    }

    console.log('Fetching image from:', imageUrl);

    // 通过服务端获取图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': urlObj.origin,
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
      next: { revalidate: 3600 },
    });

    console.log('Image fetch response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`Failed to fetch image ${imageUrl}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          error: `Failed to fetch image: ${response.statusText}`,
          status: response.status,
          url: imageUrl
        },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 返回图片
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: unknown) {
    console.error('Error proxying image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to proxy image', details: errorMessage },
      { status: 500 }
    );
  }
}

