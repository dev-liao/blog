import { getArticlesByCategory } from "@/lib/articles";
import ArticleList from "@/components/ArticleList";

export default function Reading() {
  // 在服务端获取读书分类的文章
  const articles = getArticlesByCategory('读书');

  return (
    <ArticleList
      initialArticles={articles}
      title="读书"
      description="随笔小记"
    />
  );
}

