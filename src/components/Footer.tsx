import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      href: "#",
      icon: "/icon-github.png",
      alt: "GitHub"
    },
    {
      name: "RedNote",
      href: "#",
      icon: "/icon-rednote.png",
      alt: "RedNote"
    },
    {
      name: "Weibo",
      href: "#",
      icon: "/icon-weibo.png",
      alt: "Weibo"
    },
    {
      name: "bilibili",
      href: "#",
      icon: "/icon-bilibili.png",
      alt: "bilibili"
    }
  ];

  return (
    <footer className="border-t bg-white dark:bg-slate-900 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              最新动态
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={link.alt}
                >
                  <Image
                    src={link.icon}
                    alt={link.alt}
                    width={24}
                    height={24}
                    className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
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
