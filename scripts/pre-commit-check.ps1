# 提交前构建检查脚本
# 确保代码能够正常编译通过后才允许提交

Write-Host "🔍 开始提交前构建检查..." -ForegroundColor Green

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-Host "❌ 错误：请在项目根目录下运行此脚本" -ForegroundColor Red
    exit 1
}

# 运行构建检查
Write-Host "📦 正在运行构建检查..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败！请修复以下错误后再提交：" -ForegroundColor Red
    Write-Host $buildResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建检查通过！代码可以安全提交。" -ForegroundColor Green
Write-Host "📊 构建统计：" -ForegroundColor Cyan
Write-Host $buildResult -ForegroundColor White

exit 0


