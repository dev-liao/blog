import { getArticlesByCategory } from "@/lib/articles";
import ArticleList from "@/components/ArticleList";

export default function Articles() {
  // 在服务端获取技术分类的文章（只显示 category === '技术' 的文章）
  const techArticles = getArticlesByCategory('技术');

  return (
    <ArticleList
      initialArticles={techArticles}
      title="技术"
      description="嵌入式、AI、Linux技术分享"
    />
  );
}
