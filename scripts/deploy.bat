@echo off
REM 部署脚本 - Next.js 博客 v1.4.0 (Windows)
REM 使用方法: scripts\deploy.bat

echo 🚀 开始部署 Next.js 博客 v1.4.0...

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查 Git 状态
echo 📋 检查 Git 状态...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  警告: 有未提交的更改
    set /p continue="是否继续部署? (y/N): "
    if /i not "%continue%"=="y" (
        echo ❌ 部署已取消
        pause
        exit /b 1
    )
)

REM 构建项目
echo 🔨 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 检查 Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 安装 Vercel CLI...
    call npm install -g vercel
)

REM 部署到 Vercel
echo 🚀 部署到 Vercel...
call vercel --prod
if %errorlevel% equ 0 (
    echo ✅ 部署成功!
    echo 🌐 您的博客已上线
) else (
    echo ❌ 部署失败
    pause
    exit /b 1
)

pause
