# Australia Slang – 编码规范 (coderule)

## 技术栈
- **前端/后端**: Next.js (App Router) + TypeScript + React 18+
- **数据库**: PostgreSQL + Prisma
- **校验**: Zod
- **样式**: Tailwind CSS

## 目录与分层
- **API 层**: `src/app/api/*` – 仅解析请求、调用 service、返回 HTTP
- **Service 层**: `src/lib/services/*` – 业务逻辑、参数校验、组合 repository
- **Repository 层**: `src/lib/repositories/*` – 纯数据访问（Prisma）
- **校验**: `src/lib/validators/*` – Zod schema 与类型
- **页面**: `src/app/**/page.tsx` – 布局与组合组件，不直接写 fetch
- **组件**: `src/components/**` – 按领域拆分（slang, quiz, admin, layout, common）
- **Hooks**: `src/hooks/*` – 数据与状态逻辑，封装 API 调用

## 命名
- **文件**: 逻辑/领域 + 驼峰，如 `slangService.ts`, `SlangAdminForm.tsx`
- **组件**: PascalCase，如 `SlangCard.tsx`
- **变量/函数**: camelCase，如 `findSlangById`, `useSlangSearch`

## 文件长度
- 单文件 **&lt; 200 行**。接近时拆分为更小的 service/repository 或组件。

## 错误处理
- Service 抛出 `AppError`（validationError, notFoundError, conflictError）
- API route 统一用 `handleApiError` 转为 HTTP 状态码（400/404/409/500）

## 异步
- 统一使用 **async/await**，不在组件中写裸 `fetch`，由 hooks 或 API 封装负责。

## 测试
- 后端 API: Jest + Supertest
- 前端组件: Jest + React Testing Library
- 新功能需配套基础单元/接口测试。
