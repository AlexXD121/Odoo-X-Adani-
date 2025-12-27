'use client';

import { useDroppable } from '@dnd-kit/core';
import { cn } from "@/lib/utils";

interface BoardColumnProps {
    id: string;
    title: string;
    count: number;
    color: string; // Tailwind border color class e.g. "border-blue-500"
    children: React.ReactNode;
}

export function BoardColumn({ id, title, count, color, children }: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-full bg-slate-50/50 rounded-xl">
            {/* Header */}
            <div className={cn("p-3 border-t-4 bg-white rounded-t-xl shadow-sm mb-4 flex justify-between items-center", color)}>
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {count}
                </span>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-2 space-y-3 rounded-b-xl transition-colors",
                    isOver ? "bg-slate-100/80 ring-2 ring-inset ring-slate-200" : ""
                )}
            >
                {children}

                {/* Empty State visual helper */}
                {count === 0 && !isOver && (
                    <div className="h-full flex items-center justify-center text-slate-300 text-sm border-2 border-dashed border-slate-200 rounded-lg m-2">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
}
