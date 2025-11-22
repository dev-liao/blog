import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-slate-900 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Next.js 博客
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              基于 Next.js 14+、TypeScript、Tailwind CSS 和 shadcn/ui 构建的现代化博客平台。
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                LinkedIn
              </a>
              <a href="/feed.xml" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                RSS
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* 技术栈 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              技术栈
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-600 dark:text-slate-400">AI</li>
              <li className="text-sm text-slate-600 dark:text-slate-400">Linux</li>
              <li className="text-sm text-slate-600 dark:text-slate-400">嵌入式</li>
              <li className="text-sm text-slate-600 dark:text-slate-400">人形机器人</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>&copy; 2025 Next.js 博客. 使用 Next.js 和 shadcn/ui 构建.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
