'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: { profileId: string; subjectId: string; totalDurationMs: number }) => void;
    initialData?: { profileId: string; subjectId: string; totalDurationMs: number };
}

export default function SessionModal({ isOpen, onClose, onSave, initialData }: SessionModalProps) {
    const [profileId, setProfileId] = useState(initialData?.profileId || '');
    const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
    const [minutes, setMinutes] = useState(initialData ? String(initialData.totalDurationMs / 60000) : '60');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId.trim() || !subjectId.trim() || !minutes.trim()) return;

        onSave({
            profileId: profileId.trim(),
            subjectId: subjectId.trim(),
            totalDurationMs: parseInt(minutes) * 60000,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-foreground mb-6">
                    {initialData ? 'Edit Session' : 'New Session'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Student Name</label>
                        <input
                            type="text"
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                            placeholder="e.g. Alice"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                        <input
                            type="text"
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            placeholder="e.g. Mathematics"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Duration (Minutes)</label>
                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            min="1"
                            max="600"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-sm"
                    >
                        {initialData ? 'Save Changes' : 'Create Session'}
                    </button>
                </form>
            </div>
        </div>
    );
}
