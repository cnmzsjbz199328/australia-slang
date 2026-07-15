# Australia Slang – 编码规范 (coderule)

## 技术栈
- **框架**: Next.js (App Router，静态导出 `output: 'export'`) + TypeScript + React 19
- **样式**: Tailwind CSS
- **数据**: `src/data` 下的静态 JSON（构建期用 Zod 校验），无数据库、无后端

## 架构原则
- **纯前端**: 运行时没有 API、数据库或鉴权。词典与测验都从静态数据派生。
- **单一数据源**: `src/data/data-batch-*.json` 是唯一内容来源；词典与测验共用。
- **内容管理即 Git**: 改内容 = 改 JSON + 提交，天然带版本历史与审查。

## 目录与分层
- **数据**: `src/data/*` – JSON 批次文件 + `schema.ts`（Zod）
- **数据函数**: `src/lib/*` – 纯函数，无副作用（`dataset.ts` 派生 slug，`slang.ts` 搜索/分页，`quiz.ts` 抽题/判分）
- **页面**: `src/app/**/page.tsx` – 布局与组合组件；静态生成（`generateStaticParams`/`generateMetadata`）
- **组件**: `src/components/**` – 按领域拆分（slang, quiz, layout, common, home）
- **Hooks**: `src/hooks/*` – 仅客户端 UI 状态，不做网络请求
- **脚本**: `scripts/*` – 构建期工具（数据校验）

## 命名
- **文件**: 逻辑/领域 + 驼峰，如 `slang.ts`；组件 PascalCase，如 `SlangCard.tsx`
- **变量/函数**: camelCase，如 `getSlangBySlug`, `useSlangSearch`

## 文件长度
- 单文件 **< 200 行**，接近时拆分为更小的函数或组件。

## 数据
- 新增/修改内容后运行 `npm run validate-data`（`build`/`test` 前自动执行）。
- 校验保证：字段完整、每题恰有一个正确选项、phrase 不重复。

## 测试
- 纯函数用 Jest 单元测试（`tests/lib/*`），不依赖数据库。
- 新功能需配套单元测试。
