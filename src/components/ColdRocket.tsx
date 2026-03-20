import React from 'react';

export function ColdRocket({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            {/* 左右辅助推进器 (Side Boosters) */}
            <path d="M 25 50 Q 15 70 15 90 L 35 85 Z" fill="#64748b" />
            <path d="M 75 50 Q 85 70 85 90 L 65 85 Z" fill="#64748b" />

            {/* 主尾翼 (Center Fin) */}
            <path d="M 50 60 L 55 95 L 45 95 Z" fill="#475569" />

            {/* 火箭主体 (Main Fuselage) - 流线型 */}
            <path d="M 50 5 Q 25 30 30 80 L 70 80 Q 75 30 50 5" fill="#e2e8f0" />

            {/* 驾驶舱舷窗 (Cockpit Window) */}
            <circle cx="50" cy="40" r="10" fill="#0f172a" />
            <circle cx="50" cy="40" r="8" fill="#38bdf8" />

            {/* 高科技面板纹理 (Sci-fi Panel Lines) */}
            <path d="M 35 60 L 65 60" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <path d="M 32 70 L 68 70" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* 主引擎喷口 (Main Engine Nozzle) - 完美平齐的底部，方便对接火焰 */}
            <path d="M 40 80 L 35 95 L 65 95 L 60 80 Z" fill="#1e293b" />
        </svg>
    );
}