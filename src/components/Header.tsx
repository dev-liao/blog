import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const navItems = [
    { href: "/", label: "首页", key: "home" },
    { href: "/articles", label: "文章", key: "articles" },
    { href: "/about", label: "关于", key: "about" },
  ];

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Next.js 博客
          </Link>
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="w-48 md:w-64 hidden sm:block">
              <SearchBar />
            </div>
            
            {/* 导航菜单 */}
            <div className="flex items-center gap-4">
              <div className="flex gap-4 md:gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`text-sm md:text-base transition-colors ${
                      currentPage === item.key
                        ? "text-slate-900 dark:text-white font-medium"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* 主题切换按钮 */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
