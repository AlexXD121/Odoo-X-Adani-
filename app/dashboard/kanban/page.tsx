'use client';
import KanbanBoard from '@/components/kanban/Board';

export default function KanbanPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Maintenance Board</h2>
            <div className="h-[calc(100vh-12rem)]">
                <KanbanBoard />
            </div>
        </div>
    );
}
