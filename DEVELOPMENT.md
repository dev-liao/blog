# 开发指南

## 提交前检查流程

为了确保代码质量，所有代码提交前都必须通过构建检查。

### 自动检查

在提交代码前，请运行以下命令进行构建检查：

```bash
# 使用批处理脚本（推荐）
.\check-build.bat

# 或使用npm脚本
npm run pre-commit
```

### 检查内容

- ✅ TypeScript 类型检查
- ✅ ESLint 代码规范检查
- ✅ Next.js 构建编译
- ✅ 静态页面生成
- ✅ 构建优化

### 提交规则

1. **必须通过构建检查** - 如果构建失败，不允许提交
2. **修复所有错误** - 包括TypeScript错误和ESLint警告
3. **测试功能** - 确保新功能正常工作
4. **更新文档** - 如有必要，更新相关文档

### 常见问题

#### 构建失败
- 检查TypeScript类型错误
- 修复ESLint警告
- 确保所有导入正确

#### 警告处理
- 未使用的变量：删除或使用
- 未使用的导入：删除
- 类型错误：修复类型定义

### 开发流程

1. 开发新功能
2. 运行 `.\check-build.bat` 检查
3. 修复所有错误和警告
4. 再次运行检查确保通过
5. 提交代码

## 项目结构

```
nextjs-blog/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数和配置
│   └── contexts/            # React Context
├── scripts/                 # 构建和部署脚本
├── check-build.bat         # 提交前检查脚本
└── package.json            # 项目配置
```

## 技术栈

- **Next.js 15.5.3** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - 组件库
- **Turbopack** - 构建工具
