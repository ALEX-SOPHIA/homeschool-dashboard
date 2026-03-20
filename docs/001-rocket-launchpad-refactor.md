# ADR 001: 任务看板游戏化重构与零依赖视觉升级
**(Refactoring Task Dashboard to Gamified Rocket Launchpad)**

**Date (日期):** 2026-03-20
**Status (状态):** Accepted (已采纳)
**Authors (作者):** Alex & 架构组

## 1. Context (背景与痛点)
当前的 `TaskDashboard` 存在以下工程与产品体验上的瓶颈：
* **业务层面 (Product UX):** Homeschooling 的单次任务周期较长（约 30 分钟），传统的纯数字看板（Stats Grid）缺乏即时、强烈的正向反馈机制，难以持续激发儿童用户的打卡动力。
* **技术层面 (Technical Debt):** 现有的视觉方案依赖于外部热更新图片（Hotlinked images，如 `stardust.png`），存在网络延迟和图片源失效（Link Rot）的单点故障风险。

## 2. Decision (架构决策)
我们决定彻底废弃静态数据看板，采用**高保真物理动画**与**程序化生成技术**进行游戏化重构（Gamification）。

* **纯 CSS 资产 (Procedural Assets):** 移除所有外部背景图依赖，使用 Tailwind CSS 的径向渐变（`radial-gradient`）和关键帧（`@keyframes`）手搓宇宙深空背景和星云星球。实现真正的 **Zero-dependency (零依赖)**。
* **状态机驱动 (State Machine):** 引入四阶段动画状态机（`idle` -> `shaking` -> `liftoff` -> `completed`），将 React State 与 CSS 动画物理层深度解耦。
* **响应式流体布局 (Responsive Fluid Layout):** 能量导管摒弃绝对像素限制，采用 `justify-center` 结合动态宽度跨度，确保全端 UI 对齐。

## 3. Consequences (结果与权衡 Trade-offs)

### ✅ 正向收益 (Pros)
1. **极致加载速度:** 零外部图片请求，画面达到 100% 瞬时渲染 (Instant First Contentful Paint)。
2. **体验跃升:** 引入橙色高能火焰（`#f97316`）与 45 度角发射轨迹，视觉对比度极高，显著增强了打卡时的多巴胺反馈。
3. **消除技术债:** 借此重构，清理了 `globals.css` 中超 150 行废弃代码，并修复了文件上传输入框锁死的原生 Bug。

### ⚠️ 风险与缓解措施 (Risks & Mitigations)
* **内存泄漏风险 (Memory Leaks):** 引入音频与长动画后，如果用户强制切页可能导致幽灵音效。
  * *缓解措施:* 已在 `RocketLaunchpad` 的 `useEffect` 卸载周期 (Cleanup) 中强制注入 `audio.pause()` 拦截器。