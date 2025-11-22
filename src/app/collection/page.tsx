import { getArticlesByCategory } from "@/lib/articles";
import ArticleList from "@/components/ArticleList";

export default function Collection() {
  // 在服务端获取收藏分类的文章
  const articles = getArticlesByCategory('收藏');

  return (
    <ArticleList
      initialArticles={articles}
      title="收藏"
      description="有趣的网站、页面合集"
    />
  );
}

