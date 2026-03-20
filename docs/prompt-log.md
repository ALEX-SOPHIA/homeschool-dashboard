# 2026-03-20 

🏗️ Designing the Commercial Schema (设计商业级表结构)
For a multi-tenant (多租户) application like your Homeschool Dashboard, we need to design a highly scalable relational database structure (关系型数据库结构). We will define four core models (模型/数据表):

Family: The root tenant (根租户). This ensures data isolation so Family A never sees Family B's data.

Student: The children belonging to a specific family.

Task: The courses or assignments assigned to a specific student.

TimeSession: The "ledger" (流水账) we discussed earlier. It records every single timer session for analytics.


