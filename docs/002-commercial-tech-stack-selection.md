# ADR 002: Commercial Tech Stack Selection for Go-to-Market (ADR 002：面向商业化推向市场的技术栈选型)

**Date (日期):** 2026-03-20
**Status (状态):** Accepted (已采纳)
**Authors (作者):** Alex & Architecture Team (Alex 与架构组)

## 1. Context (背景与痛点)
The current application operates as a local-first MVP using client-side state management. (当前应用作为一个使用客户端状态管理的本地优先 MVP 运行。)
To transition into a multi-tenant, cross-device commercial SaaS, we must establish a robust, scalable, and cost-effective cloud infrastructure. (为了向多租户、跨设备的商业 SaaS 转型，我们必须建立一个健壮、可扩展且具备成本效益的云端基础设施。)
The architecture needs to support strict data isolation between families, real-time synchronization, and rapid iteration. (该架构需要支持不同家庭间严格的数据隔离、实时同步以及快速迭代。)

## 2. Decision (架构决策)
We will adopt the modern agile SaaS standard stack, often referred to as the Next.js/Supabase/Prisma stack. (我们将采用现代敏捷 SaaS 标配技术栈，通常被称为 Next.js/Supabase/Prisma 技术栈。)

* **Frontend UI & Interaction (前端 UI 与交互): React / Next.js / Tailwind CSS / Zustand.**
  Next.js provides Server-Side Rendering (SSR) and seamless API routes, while Tailwind and Zustand ensure high-performance styling and local state management. (Next.js 提供了服务端渲染（SSR）和无缝的 API 路由，而 Tailwind 和 Zustand 则确保了高性能的样式编写和本地状态管理。)
* **Database & Authentication (数据库与账号系统): Supabase (PostgreSQL).**
  Supabase serves as our primary backend-as-a-service (BaaS), offering a fully managed PostgreSQL database with built-in multi-tenant authentication and Row Level Security (RLS). (Supabase 作为我们主要的后端即服务（BaaS），提供全托管的 PostgreSQL 数据库，并内置多租户身份认证和行级安全（RLS）机制。)
* **Database ORM (数据库管家/对象关系映射): Prisma.**
  Prisma acts as our strictly typed data access layer, eliminating raw SQL queries and guaranteeing end-to-end type safety between the database and the frontend. (Prisma 作为我们严格类型化的数据访问层，消除了原生 SQL 查询，并保证了数据库与前端之间端到端的类型安全。)
* **Hosting & Deployment (服务器部署): Vercel.**
  Vercel provides zero-configuration deployment, Edge computing capabilities, and perfect integration with Next.js, acting as our global CDN and serverless runtime environment. (Vercel 提供零配置部署、边缘计算能力以及与 Next.js 的完美集成，作为我们的全球 CDN 和无服务器运行环境。)

## 3. Consequences (结果与权衡)

### ✅ Positive Outcomes (正向收益)
1. **Accelerated Time-to-Market (极速上市):** The tight integration between Vercel, Next.js, and Supabase significantly reduces DevOps overhead. (Vercel、Next.js 和 Supabase 之间的紧密集成大幅减少了运维开销。)
2. **End-to-End Type Safety (端到端类型安全):** Prisma combined with TypeScript prevents runtime errors and acts as executable documentation for our data models. (Prisma 结合 TypeScript 可防止运行时错误，并作为我们数据模型的可执行文档。)
3. **High ROI (高投资回报率):** Generous free tiers from Supabase and Vercel allow us to validate the commercial model with near-zero initial infrastructure costs. (Supabase 和 Vercel 慷慨的免费额度使我们能够以几乎为零的初始基础设施成本来验证商业模式。)

### ⚠️ Risks & Mitigations (风险与缓解措施)
* **Vendor Lock-in (供应商锁定风险):** Heavy reliance on Vercel and Supabase specific features. (严重依赖 Vercel 和 Supabase 的特定功能。)
  * *Mitigation (缓解措施):* Supabase is open-source and standard PostgreSQL under the hood; we can self-host or migrate the database dump if scaling costs become prohibitive. (Supabase 底层是开源的标准 PostgreSQL；如果扩展成本过高，我们可以自行托管或迁移数据库备份。)