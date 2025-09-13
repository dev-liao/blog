"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, User, Calendar } from "lucide-react";

interface Comment {
  id: number;
  name: string;
  email: string;
  content: string;
  date: string;
  articleId: number;
}

interface CommentSectionProps {
  articleId: number;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 从localStorage加载评论
    const savedComments = JSON.parse(localStorage.getItem(`comments-${articleId}`) || "[]");
    setComments(savedComments);
  }, [articleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    const comment: Comment = {
      id: Date.now(),
      name: newComment.name.trim(),
      email: newComment.email.trim(),
      content: newComment.content.trim(),
      date: new Date().toLocaleDateString("zh-CN"),
      articleId
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${articleId}`, JSON.stringify(updatedComments));

    setNewComment({ name: "", email: "", content: "" });
    setIsSubmitting(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="请输入您的邮箱（可选）"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">评论内容 *</Label>
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
        </CardContent>
      </Card>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
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
                        {comment.name}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {comment.date}
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
