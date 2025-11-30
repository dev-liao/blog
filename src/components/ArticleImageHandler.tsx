'use client';

import { useEffect } from 'react';

export default function ArticleImageHandler() {
  useEffect(() => {
    // 处理图片加载错误的内部函数
    const processImageError = (img: HTMLImageElement) => {
      console.error('Image failed to load:', img.src);
      
      // 如果是代理 URL，尝试使用 data-original-url 回退到原始 URL
      if (img.src.includes('/api/image-proxy')) {
        const originalUrl = img.getAttribute('data-original-url');
        if (originalUrl) {
          console.log('Proxy failed, retrying with original URL:', originalUrl);
          // 设置 referrerPolicy 后重试
          img.referrerPolicy = 'no-referrer';
          img.crossOrigin = 'anonymous';
          img.src = originalUrl;
          return;
        }
        
        // 如果没有 data-original-url，尝试从 URL 参数中提取
        try {
          const urlParams = new URLSearchParams(img.src.split('?')[1]);
          const urlFromParams = urlParams.get('url');
          if (urlFromParams) {
            console.log('Retrying with URL from params:', urlFromParams);
            img.referrerPolicy = 'no-referrer';
            img.crossOrigin = 'anonymous';
            img.src = urlFromParams;
            return;
          }
        } catch (e) {
          console.error('Error parsing URL params:', e);
        }
      }
      
      // 如果所有尝试都失败，添加错误占位符样式
      img.style.border = '2px dashed #ccc';
      img.style.backgroundColor = '#f5f5f5';
      img.alt = '图片加载失败: ' + (img.alt || '');
    };

    // 处理图片加载成功的内部函数
    const processImageLoad = (img: HTMLImageElement) => {
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

    // 处理图片加载错误（事件处理器）
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      processImageError(img);
    };

    // 处理图片加载成功（事件处理器）
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      processImageLoad(img);
    };

    // 为所有图片添加事件监听器
    const images = document.querySelectorAll('.article-content img, .article-image');
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      
      // 如果是代理 URL，确保有 data-original-url 属性
      if (imageElement.src.includes('/api/image-proxy')) {
        const originalUrl = imageElement.getAttribute('data-original-url');
        if (!originalUrl) {
          // 尝试从 URL 参数中提取并保存
          try {
            const urlParams = new URLSearchParams(imageElement.src.split('?')[1]);
            const urlFromParams = urlParams.get('url');
            if (urlFromParams) {
              imageElement.setAttribute('data-original-url', urlFromParams);
            }
          } catch (e) {
            console.error('Error extracting original URL:', e);
          }
        }
        // 设置 referrerPolicy 和 crossOrigin
        imageElement.referrerPolicy = 'no-referrer';
        imageElement.crossOrigin = 'anonymous';
      } else if (imageElement.src.includes('gitee.com')) {
        // 如果是直接的 Gitee 图片，设置 referrerPolicy
        imageElement.referrerPolicy = 'no-referrer';
        imageElement.crossOrigin = 'anonymous';
        // 保存原始 URL
        imageElement.setAttribute('data-original-url', imageElement.src);
      }
      
      imageElement.addEventListener('error', handleImageError);
      imageElement.addEventListener('load', handleImageLoad);
      
      // 如果图片已经加载完成
      if (imageElement.complete) {
        if (imageElement.naturalHeight === 0) {
          processImageError(imageElement);
        } else {
          processImageLoad(imageElement);
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

