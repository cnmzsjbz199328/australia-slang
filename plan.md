---
name: Home showcase slang layout admin auth
overview: "Three optimizations: (1) Replace Home nav cards with a dynamic dictionary-style showcase; (2) Merge slang example into list cards and remove the separate detail panel; (3) Add admin login to protect /admin routes."
todos:
  - id: optimize-slang-dictionary
    content: 重构词典页为单栏布局，将例句整合进列表卡片，移除右侧详情区和相关状态逻辑
    status: done
  - id: update-home-page
    content: 改造首页，移除导航卡片，实现动态俚语展示组件 (SlangShowcase)
    status: done
  - id: remove-redundant-nav-home
    content: 移除 Navbar 中的 Home 链接，仅保留 Logo 作为首页入口
    status: pending
  - id: implement-admin-auth
    content: 集成 NextAuth.js，实现 Admin 登录页、凭证校验及路由保护
    status: pending
isProject: false
---

# 三项优化计划：首页展示、词典布局、Admin 登录

## 1. 首页：去掉重复导航，改为动态词典效果展示

### 现状

- [src/app/page.tsx](australia-slang/src/app/page.tsx) 当前为标题 + 两个导航卡片（Slang Dictionary、Quiz），与 Header 的导航重复。

### 目标

- 移除首页的导航卡片。
- 设计一个**动态词典效果**的展示区，体现「澳洲俚语」主题：让访客一眼看到网站内容形态（词条 + 释义 + 例句），并保留进入词典/测验的入口（可保留少量引导，但不重复 Header）。

### 实现要点

- **数据**：首页从 API 拉取少量俚语（例如 `GET /api/slang?pageSize=6` 或新增 `GET /api/slang/featured?limit=6`），用于展示。
- **展示形式**（任选一种或组合，由你偏好决定）：
  - **轮播/轮换**：每隔几秒切换一条俚语，展示 phrase + meaning + example，带淡入淡出或滑动。
  - **词典翻页/打字机**：一条条展示，配合简短动画（如打字机效果或逐行出现）。
  - **静态精选区**：固定展示 3–6 条俚语卡片（phrase、meaning、example 同词典样式），下方一句「更多词条请到 Slang Dictionary」+ 链接。
- **技术**：首页可为 client 组件，用 `fetch('/api/slang?pageSize=6')` 或服务端在 `page.tsx` 内直接调用 `slangService.searchSlang` 取数后传入展示组件；单文件 &lt;200 行，复杂动画可拆到 `src/components/home/SlangShowcase.tsx`。
- **不增加**：不新增数据库字段；沿用现有 `phrase`、`meaning`、`example`。

---

## 2. 词典页：例句整合进列表项，取消右侧详情区

### 现状

- [src/app/slang/page.tsx](australia-slang/src/app/slang/page.tsx) 为两栏：左侧列表（SlangList + SlangCard）+ 右侧 SlangDetail（article）。
- 列表项 [SlangCard](australia-slang/src/components/slang/SlangCard.tsx) 只显示 phrase + meaning；详情区单独显示 phrase + meaning + example。

### 目标

- **不再使用右侧详情区**：移除两栏布局和 `SlangDetail` 的展示。
- **例句整合进列表项**：每条列表项（当前 SlangCard 的 button）内直接展示 phrase + meaning + **example**（若有），一屏内完成阅读，更简洁直观。
- 保留搜索、分页、列表单栏布局。

### 实现要点

- **API**：`GET /api/slang` 已通过 Prisma 返回完整 `SlangTerm`（含 `example`），无需改接口。
- **SlangCard**：[SlangCard](australia-slang/src/components/slang/SlangCard.tsx) 的 `SlangTermBrief` 已含 `example: string | null`。在卡片内增加一行：若有 `term.example` 则显示为小号斜体，如 `Example: {term.example}`；可保留 `line-clamp-2` 仅用于 meaning，或对 example 使用 `line-clamp-1` 避免过高。
- **交互**：取消「选中某条再在右侧看详情」的交互。卡片可改为不可点击或仅保留样式（无 `onSelect`），或保留轻微 hover 高亮；移除 `selectedId`、`detail`、`detailLoading` 相关逻辑。
- **Slang 页面**：[src/app/slang/page.tsx](australia-slang/src/app/slang/page.tsx) 改为单栏：搜索 + SlangList（仅列表，无右侧列）。删除对 SlangDetail 的引用与布局。
- **useSlangSearch**：[src/hooks/useSlangSearch.ts](australia-slang/src/hooks/useSlangSearch.ts) 移除 `selectedId`、`setSelectedId`、`detail`、`detailLoading` 以及根据 `selectedId` 请求 `GET /api/slang/:id` 的 `useEffect`，只保留列表数据与分页。
- **SlangList**：[src/components/slang/SlangList.tsx](australia-slang/src/components/slang/SlangList.tsx) 去掉 `selectedId`、`onSelect`、卡片选中态；仅渲染 SlangCard 列表，不再传 `selected` 或 `onSelect`（或传空实现）。SlangCard 可改为 `div` 或保留 `button` 仅作样式。
- **SlangDetail**：可从词典页移除引用；组件文件可保留以备它用（如首页展示复用）或后续删除。
- 单文件行数保持 &lt;200。

---

## 3. Admin：管理员登录

### 现状

- `/admin`、`/admin/slang`、`/admin/quiz` 无鉴权，任何人可访问。

### 目标

- 为 Admin 设计**管理员登录**：仅通过登录验证的用户可访问 `/admin` 及其子路径；未登录访问 admin 时跳转登录页，登录成功后进入 admin。

### 实现要点（推荐方案：NextAuth + Credentials，无用户表）

- **认证方案**：使用 **NextAuth.js** 的 Credentials Provider，不新增用户表。管理员账号由环境变量提供，例如：
  - `ADMIN_USERNAME`、`ADMIN_PASSWORD`，或
  - 仅 `ADMIN_PASSWORD`（用户名固定为 `admin`）。
- **会话**：NextAuth 默认使用 JWT 或 database session；本项目可采用 **JWT**，无需新表。登录成功后写 cookie，后续在服务端用 `getServerSession` 校验。
- **路由保护**：
  - **方式 A**：在 [src/app/admin/layout.tsx](australia-slang/src/app/admin/layout.tsx)（新建）中服务端 `getServerSession`，若未登录则 `redirect('/admin/login')`；登录页为 `src/app/admin/login/page.tsx`（或 `src/app/login/page.tsx` 并重定向回 `/admin`）。
  - **方式 B**：使用 NextAuth 的 middleware 保护 `/admin`：仅允许已登录用户访问，否则重定向到 NextAuth 的 signIn 页（可配置 `pages.signIn: '/admin/login'`）。
- **登录页**：`/admin/login` 提供表单（用户名 + 密码），提交后调用 `signIn('credentials', { username, password, callbackUrl: '/admin' })`。校验逻辑在 NextAuth 的 Credentials authorize 中比对环境变量。
- **登出**：Header 或 Admin 布局中提供「登出」按钮，调用 `signOut()`。
- **环境变量**：在 `.env.example` 中增加占位符 `ADMIN_USERNAME`、`ADMIN_PASSWORD`（或仅 `ADMIN_PASSWORD`）；不在代码中写死密码。
- **依赖**：`npm install next-auth`。
- 新建/修改文件建议：
  - `src/app/api/auth/[...nextauth]/route.ts`（NextAuth 路由）
  - `src/lib/auth.ts`（或 `auth.config.ts`）：NextAuth 配置（providers、session、pages、env 校验）
  - `src/app/admin/login/page.tsx`：登录表单
  - `src/app/admin/layout.tsx`：服务端 session 检查 + 未登录重定向；或使用 `middleware.ts` 保护 `/admin`
  - Navbar：在 Admin 区域显示「登出」或仅在已登录时显示 Admin 链接（可选）

### 备选（简化版）

- 若暂不引入 NextAuth：可用**单密码**方案——在 middleware 或 layout 中检查 cookie（如登录页设置 `admin_token=hash(ADMIN_PASSWORD)`），仅校验密码一致即视为已登录。实现更快，但无标准 session、无用户名，扩展性差；建议仍采用 NextAuth。

---

## 实施顺序建议

1. **词典页与卡片**：改 SlangCard、SlangList、slang/page、useSlangSearch，移除 SlangDetail 与选中态（影响范围小、无新依赖）。
2. **首页**：实现动态词典展示并替换现有导航卡片（依赖现有 API）。
3. **Admin 登录**：安装 NextAuth、配置 Credentials、登录页、admin layout 或 middleware 保护、环境变量与 .env.example。

---

## 文件变更汇总（便于审核）


| 区域       | 文件                                                                                       | 变更                                                     |
| -------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 首页       | [src/app/page.tsx](australia-slang/src/app/page.tsx)                                     | 移除导航卡片，接入动态词典展示组件                                      |
| 首页       | 新建 `src/components/home/SlangShowcase.tsx`（或同名）                                          | 词典效果展示（轮播/静态/打字机等）                                     |
| 词典       | [src/app/slang/page.tsx](australia-slang/src/app/slang/page.tsx)                         | 单栏布局，移除 SlangDetail 与选中逻辑                              |
| 词典       | [src/components/slang/SlangCard.tsx](australia-slang/src/components/slang/SlangCard.tsx) | 增加 example 展示；可选去掉 onSelect/selected                   |
| 词典       | [src/components/slang/SlangList.tsx](australia-slang/src/components/slang/SlangList.tsx) | 移除 selectedId、onSelect、选中态                             |
| 词典       | [src/hooks/useSlangSearch.ts](australia-slang/src/hooks/useSlangSearch.ts)               | 移除 selectedId、detail、detailLoading 及 /api/slang/:id 请求 |
| Admin 登录 | 新建 `src/app/api/auth/[...nextauth]/route.ts`                                             | NextAuth API 路由                                        |
| Admin 登录 | 新建 `src/lib/auth.ts`                                                                     | NextAuth 配置（Credentials、env）                           |
| Admin 登录 | 新建 `src/app/admin/login/page.tsx`                                                        | 登录表单页                                                  |
| Admin 登录 | 新建/修改 `src/app/admin/layout.tsx`                                                         | Session 校验，未登录重定向至 /admin/login                        |
| Admin 登录 | [.env.example](australia-slang/.env.example)                                             | 增加 ADMIN_USERNAME、ADMIN_PASSWORD 占位符                   |
| 可选       | [src/components/layout/Navbar.tsx](australia-slang/src/components/layout/Navbar.tsx)     | 已登录时显示 Admin 链接或登出按钮                                   |


以上为三项优化的完整计划，可按你确认后的顺序实施。