"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, User, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommentWithAuthor } from "@/lib/supabaseComments";

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState({
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 API 加载评论
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?articleId=${articleId}`);
        const data = await response.json();
        if (data.comments) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('请先登录后再发表评论');
      return;
    }

    if (!newComment.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          user_id: user.id,
          content: newComment.content.trim()
        })
      });

      const data = await response.json();

      if (data.comment) {
        setComments(prev => [...prev, data.comment]);
        setNewComment({ content: "" });
      } else {
        alert('发表评论失败，请重试');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('发表评论失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 评论表单 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">发表评论</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Textarea
                  id="content"
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入您的评论..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? "提交中..." : "发表评论"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              请先登录后再发表评论
            </div>
          )}
        </CardContent>
      </Card>

      {/* 评论列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            加载评论中...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            暂无评论，快来发表第一条评论吧！
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {comment.author.name}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(comment.created_at).toLocaleDateString("zh-CN")}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
