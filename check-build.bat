@echo off
echo 🔍 开始提交前构建检查...
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录下运行此脚本
    exit /b 1
)

REM 运行构建检查
echo 📦 正在运行构建检查...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ 构建失败！请修复错误后再提交
    exit /b 1
)

echo.
echo ✅ 构建检查通过！代码可以安全提交。
echo.
