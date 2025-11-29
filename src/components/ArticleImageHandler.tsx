'use client';

import { useEffect } from 'react';

export default function ArticleImageHandler() {
  useEffect(() => {
    // 处理图片加载错误
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      console.error('Image failed to load:', img.src);
      
      // 如果是代理 URL，尝试直接使用原始 Gitee URL
      if (img.src.includes('/api/image-proxy')) {
        const urlParams = new URLSearchParams(img.src.split('?')[1]);
        const originalUrl = urlParams.get('url');
        if (originalUrl) {
          console.log('Retrying with original URL:', originalUrl);
          // 设置 referrerPolicy 后重试
          img.referrerPolicy = 'no-referrer';
          img.src = originalUrl;
          return;
        }
      }
      
      // 添加错误占位符样式
      img.style.border = '2px dashed #ccc';
      img.style.backgroundColor = '#f5f5f5';
      img.alt = '图片加载失败: ' + (img.alt || '');
    };

    // 处理图片加载成功
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      console.log('Image loaded successfully:', img.src);
      // 确保图片可见
      img.style.display = 'block';
      img.style.visibility = 'visible';
      img.style.opacity = '1';
      // 确保图片有尺寸
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
      }
    };

    // 为所有图片添加事件监听器
    const images = document.querySelectorAll('.article-content img, .article-image');
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      
      // 如果是 Gitee 图片，设置 referrerPolicy
      if (imageElement.src.includes('gitee.com')) {
        imageElement.referrerPolicy = 'no-referrer';
        // 如果图片加载失败，尝试重新加载（可能是 Referer 问题）
        if (!imageElement.complete || imageElement.naturalHeight === 0) {
          const originalSrc = imageElement.src;
          // 尝试添加时间戳避免缓存
          imageElement.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + '_t=' + Date.now();
        }
      }
      
      imageElement.addEventListener('error', handleImageError);
      imageElement.addEventListener('load', handleImageLoad);
      
      // 如果图片已经加载完成
      if (imageElement.complete) {
        if (imageElement.naturalHeight === 0) {
          handleImageError({ target: imageElement } as Event);
        } else {
          handleImageLoad({ target: imageElement } as Event);
        }
      }
    });

    return () => {
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        imageElement.removeEventListener('error', handleImageError);
        imageElement.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return null;
}

