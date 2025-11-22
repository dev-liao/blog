import { getArticlesByCategory } from "@/lib/articles";
import ArticleList from "@/components/ArticleList";

export default function Life() {
  // 在服务端获取生活分类的文章
  const articles = getArticlesByCategory('生活');

  return (
    <ArticleList
      initialArticles={articles}
      title="生活"
      description="跑步、徒步、日常分享"
    />
  );
}

