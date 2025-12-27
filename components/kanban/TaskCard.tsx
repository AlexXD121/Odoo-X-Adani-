'use client';

import { useDraggable } from '@dnd-kit/core';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, Wrench, Trash2 } from "lucide-react";

interface TaskCardProps {
    request: any; // Type strictly if possible, using 'any' for speed as per Prisma type complexity
}

export function TaskCard({ request }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: request.id,
        data: {
            request
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Priority Colors
    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'bg-red-500';
            case 'critical': return 'bg-red-600 animate-pulse';
            case 'medium': return 'bg-orange-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-slate-400';
        }
    };

    const isOverdue = request.dueDate && new Date(request.dueDate) < new Date() && request.status !== 'repaired' && request.status !== 'scrap';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "p-4 bg-white rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-all touch-none select-none relative overflow-hidden",
                isOverdue ? "border-red-400 bg-red-50/10" : "border-slate-200",
                isDragging && "shadow-xl rotate-2 opacity-90 scale-105 z-50 ring-2 ring-blue-400"
            )}
        >
            {/* Overdue Strip */}
            {isOverdue && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-2 pl-2">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(request.priority))} />
                    <span className="text-xs font-mono text-slate-500">#{request.id.slice(0, 5)}</span>
                </div>
                {/* Status/Icons */}
                <div className="flex gap-1">
                    {isOverdue && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Overdue</span>}
                    {request.type === 'preventive' && <Clock className="w-3 h-3 text-purple-500" />}
                </div>
            </div>

            {/* Body */}
            <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-3 pl-2">
                {request.title}
            </h4>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 pl-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 max-w-[70%]">
                    <Wrench className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{request.equipment?.name || "Unknown Equipment"}</span>
                </div>

                {request.assignedTo ? (
                    <Avatar className="w-6 h-6 border-2 border-white">
                        <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
                            {request.assignedTo.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">?</span>
                    </div>
                )}
            </div>
        </div>
    );
}
