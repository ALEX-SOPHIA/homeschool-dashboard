'use client';

import { LineChart, Plus, Sparkles, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/store/useTaskStore';
import { useEffect, useState } from 'react';
import { 
    createCourseTemplate, 
    spawnTaskFromTemplate, 
    fetchAllTemplates, 
    createStudent, 
    deleteStudent, 
    deleteCourseTemplate, 
    updateCourseTemplate 
} from '@/app/actions';

// 🚀 Pure Functions outside the component
const generateTempId = () => `temp-${Math.random().toString(36).substring(2, 11)}`;
const getCurrentDate = () => new Date().toISOString().split('T')[0];

export default function Sidebar() {
    // 🗂️ Zustand Store
    const { groups, addTask, addGroup, removeGroup } = useTaskStore();
    
    // 🗂️ Local UI State
    const [isHydrated, setIsHydrated] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [templates, setTemplates] = useState<any[]>([]);
    const [isCreatingFor, setIsCreatingFor] = useState<number | null>(null);
    const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

    // 🚀 Hydration & Fetching
    useEffect(() => {
        fetchAllTemplates()
            .then(res => {
                if (res.success) setTemplates(res.templates);
            })
            .finally(() => {
                setIsHydrated(true); 
            });
    }, []);

    // 🪄 The Spawn Magic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSpawnTask = async (childId: string, groupIdx: number, template: any) => {
        const tempId = generateTempId();
        addTask(groupIdx, {
            id: tempId,
            title: template.title,
            targetDuration: template.defaultDuration.toString(), 
            status: 'pending',
            subject: template.subject,
            date: getCurrentDate()
        });
        await spawnTaskFromTemplate(childId, template);
    };

    if (!isHydrated) return (
        <div className="w-64 bg-white border-r border-slate-100 h-[calc(100vh-64px)] flex flex-col pt-6 pb-20 animate-pulse">
            <div className="px-4 mb-6"><div className="h-2 w-16 bg-slate-100 rounded mb-4" /></div>
        </div>
    );

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 h-[calc(100vh-64px)] flex flex-col pt-6 pb-6 shadow-sm z-10">
            
            <div className="px-4 mb-6 flex-1 overflow-y-auto custom-scrollbar">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1 flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400" />
                    Command Center
                </p>
                
                <div className="space-y-2">
                    {groups.map((child, idx) => {
                        const isExpanded = expandedIndex === idx;
                        const childTemplates = templates.filter(t => t.studentId === child.id || t.studentId === child.title);
                        
                        return (
                            <div key={`${child.id || child.title}-${idx}`} className="flex flex-col">
                                
                                {/* 👨‍🎓 Child Header Button */}
                                <div
                                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                                    className={`group/child w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                                        isExpanded ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-200/50 border border-transparent'
                                    }`}
                                >
                                    <div className="relative w-8 h-8 shrink-0">
                                        {child.avatar ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={child.avatar} alt={child.title} className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                {child.title.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 flex-1 text-left truncate">{child.title}</span>
                                    
                                    {/* 🗑️ Child Delete Button */}
                                    <div 
                                        className="opacity-0 group-hover/child:opacity-100 p-1.5 hover:bg-red-100 text-slate-300 hover:text-red-500 rounded-md transition-all"
                                        onClick={async (e) => {
                                            e.stopPropagation(); 
                                            if (!confirm(`Delete ${child.title} and ALL their tasks?`)) return;
                                            
                                            removeGroup(idx); 
                                            if (child.id && !child.id.startsWith('temp-')) {
                                                await deleteStudent(child.id); 
                                            }
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </div>
                                </div>

                                {/* 💊 The Capsule Drawer */}
                                {isExpanded && (
                                    <div className="pl-12 pr-2 py-3 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                        
                                        {/* Render existing capsules (3-Zone Architecture) */}
                                        {childTemplates.map(template => (
                                            <div
                                                key={template.id}
                                                className="group/capsule relative w-full text-left px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-all hover:shadow-sm flex justify-between items-center"
                                            >
                                                {/* 🎨 ZONE 1: Color Picker */}
                                                <label className="absolute left-0 top-0 bottom-0 w-1.5 cursor-pointer hover:w-2 transition-all">
                                                    <input
                                                        type="color"
                                                        defaultValue={template.color}
                                                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                        onBlur={async (e) => {
                                                            const newColor = e.target.value;
                                                            if (newColor !== template.color) {
                                                                setTemplates(templates.map(t => t.id === template.id ? { ...t, color: newColor } : t));
                                                                await updateCourseTemplate(template.id, { color: newColor });
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 rounded-l-lg" style={{ backgroundColor: template.color }} />
                                                </label>

                                                {/* ✍️ ZONE 2: Title Editor */}
                                                <div className="pl-1.5 flex-1 min-w-0 mr-2">
                                                    {editingTemplateId === template.id ? (
                                                        <input
                                                            autoFocus
                                                            className="w-full bg-slate-100 text-blue-600 outline-none px-1 rounded"
                                                            defaultValue={template.title}
                                                            onBlur={async (e) => {
                                                                const newTitle = e.target.value;
                                                                setEditingTemplateId(null);
                                                                if (newTitle && newTitle !== template.title) {
                                                                    setTemplates(templates.map(t => t.id === template.id ? { ...t, title: newTitle } : t));
                                                                    await updateCourseTemplate(template.id, { title: newTitle });
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') e.currentTarget.blur();
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="cursor-text hover:text-blue-500 truncate block transition-colors py-0.5"
                                                            onClick={() => setEditingTemplateId(template.id)}
                                                            title="Click to rename"
                                                        >
                                                            {template.title}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 🚀 ZONE 3: Action Buttons */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover/capsule:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleSpawnTask(child.id, idx, template)}
                                                        className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-2 py-1 rounded transition-colors font-black"
                                                    >
                                                        Add +
                                                    </button>
                                                    
                                                    {/* 🗑️ Template Delete Button IS HERE! */}
                                                    <button 
                                                        className="p-1 hover:bg-red-100 text-slate-300 hover:text-red-500 rounded transition-all"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (!confirm(`Delete the '${template.title}' preset?`)) return;
                                                            setTemplates(templates.filter(t => t.id !== template.id)); 
                                                            await deleteCourseTemplate(template.id); 
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* ➕ Add New Course Capsule */}
                                        {isCreatingFor === idx ? (
                                            <input
                                                autoFocus
                                                placeholder="e.g. Math, English..."
                                                className="w-full px-3 py-2 border-2 border-blue-400 rounded-lg outline-none text-slate-900 font-bold bg-white placeholder-slate-300 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                onBlur={() => setIsCreatingFor(null)}
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = e.currentTarget.value;
                                                        if (!val) return setIsCreatingFor(null);
                                                        
                                                        const res = await createCourseTemplate(child.id, {
                                                            title: val, subject: val, color: '#3b82f6', defaultDuration: 30
                                                        });
                                                        
                                                        if (res.success) {
                                                            setTemplates([...templates, res.template]);
                                                        }
                                                        setIsCreatingFor(null);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => setIsCreatingFor(idx)}
                                                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-400 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-600 transition-all flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Course
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* 👨‍👩‍👧‍👦 Add Child Button */}
                <button 
                    onClick={async () => {
                        addGroup();
                        const result = await createStudent();
                        if (!result?.success) alert("Failed to create child in the cloud.");
                    }}
                    className="w-full mt-4 flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-200/50 transition-colors text-slate-500 hover:text-slate-700 font-semibold text-sm border border-transparent hover:border-slate-200"
                >
                    <UserPlus size={16} />
                    Add Astronaut
                </button>
            </div>

            <div className="h-px bg-slate-200 mx-4 mb-4 shrink-0" />

            {/* 📊 Analytics */}
            <div className="px-4 shrink-0 space-y-1">
                <Link href="/analytics" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors font-bold text-sm hover:shadow-sm border border-transparent hover:border-slate-200">
                    <LineChart size={18} className="text-indigo-400" />
                    Analytics
                </Link>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}} />
        </div>
    );
}