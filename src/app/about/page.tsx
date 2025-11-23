import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function About() {
  // 静态头像路径，将头像图片放在 public 目录下，命名为 avatar.jpg 或 avatar.png
  const avatarPath = "/avatar.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            关于这个博客
          </h2>
          
          {/* 头像区域 */}
          <div className="flex justify-center mb-8">
            <Avatar 
              className="w-40 h-40 border-4 border-white dark:border-slate-800 shadow-lg"
            >
              <AvatarImage src={avatarPath} alt="头像" />
              <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>个人标签</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li>• 不吃折耳根</li>
                  <li>• 皮蛋认证铲屎官</li>
                  <li>• 湾区生活打工人</li>
                  <li>• 屎山代码创作师</li>
                  <li>• 三水线未毕业掉队冠军</li>
                  <li>• 未参加马拉松非严肃跑者</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>关于本站</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li>• 纯AI编码搭建</li>
                  <li>• 静态页面部署</li>
                  <li>• Markdown文章管理</li>
                  <li>• 未来考虑使用supabase</li>
                  <li>• 托管在Github部署在Vercel</li>
                  <li>• 装修中...敬请期待</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
