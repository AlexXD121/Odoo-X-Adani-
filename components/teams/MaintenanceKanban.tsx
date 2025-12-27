"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Plus,
    PlusCircle, Clock, CheckCircle2, AlertCircle,
    Monitor, Settings, Cpu, HardDrive, AlertTriangle, GripVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// DND Kit Imports
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- INITIAL MOCK DATA ---
const INITIAL_REQUESTS = [
    {
        id: "REQ-001",
        equipmentName: "Samsung Monitor 15\"",
        subject: "Heavy Flickering",
        technician: "Mitchell Admin",
        avatar: "MA",
        priority: "High",
        isOverdue: true,
        status: "new",
        icon: Monitor
    },
    {
        id: "REQ-002",
        equipmentName: "CNC Lathe X1",
        subject: "Sensor Calibration",
        technician: "Sarah Wood",
        avatar: "SW",
        priority: "Medium",
        isOverdue: false,
        status: "new",
        icon: Settings
    },
    {
        id: "REQ-003",
        equipmentName: "Hydraulic Press H5",
        subject: "Pressure Leak",
        technician: "Abigail P.",
        avatar: "AP",
        priority: "High",
        isOverdue: false,
        status: "in_progress",
        icon: HardDrive
    },
    {
        id: "REQ-004",
        equipmentName: "Workstation Dell Z4",
        subject: "System Upgrade",
        technician: "Sarah Wood",
        avatar: "SW",
        priority: "Low",
        isOverdue: false,
        status: "in_progress",
        icon: Cpu
    }
];

const COLUMNS = [
    { id: "new", title: "New", color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700", icon: PlusCircle },
    { id: "in_progress", title: "In Progress", color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-700", icon: Clock },
    { id: "repaired", title: "Repaired", color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-700", icon: CheckCircle2 },
    { id: "scrap", title: "Scrap", color: "bg-rose-500", lightColor: "bg-rose-50", textColor: "text-rose-700", icon: AlertCircle },
];

function SortableMaintenanceCard({ req }: { req: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: req.id,
        data: {
            type: 'Card',
            req
        }
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-grab active:cursor-grabbing group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-50 p-1.5 rounded-md border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <req.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{req.id}</span>
                </div>
                <div className="flex items-center gap-1">
                    {req.isOverdue && (
                        <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-bold px-1.5 py-0 h-4 flex items-center gap-1 shadow-none">
                            <AlertTriangle className="w-2.5 h-2.5" /> OVERDUE
                        </Badge>
                    )}
                    <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                </div>
            </div>

            <div className="space-y-1 mb-4">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase leading-tight tracking-tight">{req.equipmentName}</h4>
                <p className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">{req.subject}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase ring-2 ring-white">
                        {req.avatar}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{req.technician}</span>
                </div>
                <Badge variant="outline" className={`
                    text-[9px] font-bold px-2 py-0 h-4 uppercase border-slate-200 shadow-none
                    ${req.priority === 'High' ? 'text-rose-600 bg-rose-50/30' : ''}
                    ${req.priority === 'Medium' ? 'text-amber-600 bg-amber-50/30' : ''}
                    ${req.priority === 'Low' ? 'text-slate-500 bg-slate-50/30' : ''}
                `}>
                    {req.priority}
                </Badge>
            </div>
        </div>
    );
}

function KanbanColumn({ column, children }: { column: any, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full bg-slate-100/40 rounded-2xl border transition-colors overflow-hidden ${isOver ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200/60'}`}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white/50 relative">
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${column.color}`}></div>
                <div className="flex items-center gap-3 pl-1.5">
                    <div className={`${column.lightColor} p-2 rounded-lg`}>
                        <column.icon className={`w-4 h-4 ${column.textColor}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">{column.title}</h3>
                </div>
            </div>
            {children}
        </div>
    );
}

export function MaintenanceKanban() {
    const [requests, setRequests] = useState(INITIAL_REQUESTS);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeIdToken = active.id;
        const overIdToken = over.id;

        if (activeIdToken === overIdToken) return;

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveACard) return;

        if (isOverACard) {
            setRequests((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeIdToken);
                const overIndex = prev.findIndex((t) => t.id === overIdToken);

                if (prev[activeIndex].status !== prev[overIndex].status) {
                    const newStatus = prev[overIndex].status;
                    const items = [...prev];
                    items[activeIndex] = { ...items[activeIndex], status: newStatus };
                    return arrayMove(items, activeIndex, overIndex);
                }

                return arrayMove(prev, activeIndex, overIndex);
            });
        }

        if (isOverAColumn) {
            setRequests((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeIdToken);
                if (prev[activeIndex].status !== overIdToken) {
                    const items = [...prev];
                    items[activeIndex] = { ...items[activeIndex], status: overIdToken as string };
                    return arrayMove(items, activeIndex, activeIndex);
                }
                return prev;
            });
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
    }

    const activeRequest = activeId ? requests.find(r => r.id === activeId) : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Kanban Board
                    </h3>
                    <p className="text-slate-500 text-xs">Real-time maintenance request tracking</p>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2 border-none">
                    <Plus className="w-4 h-4" /> New Request
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]">
                    {COLUMNS.map((column) => {
                        const columnRequests = requests.filter(req => req.status === column.id);

                        return (
                            <KanbanColumn key={column.id} column={column}>
                                <SortableContext
                                    id={column.id}
                                    items={columnRequests.map(r => r.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px] scrollbar-hide">
                                        {columnRequests.map((req) => (
                                            <SortableMaintenanceCard key={req.id} req={req} />
                                        ))}
                                        {columnRequests.length === 0 && (
                                            <div className="h-24 rounded-xl border-2 border-dashed border-slate-200/60 flex items-center justify-center p-6 text-center">
                                                <p className="text-[11px] font-medium text-slate-400 italic">No tasks</p>
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </KanbanColumn>
                        );
                    })}
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: { active: { opacity: '0.4' } }
                    })
                }}>
                    {activeRequest ? (
                        <div className="bg-white rounded-xl border-2 border-orange-500 p-4 shadow-2xl scale-105 rotate-2 cursor-grabbing">
                            <div className="flex items-center gap-2 mb-3">
                                <activeRequest.icon className="w-4 h-4 text-orange-600" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeRequest.id}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{activeRequest.subject}</p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
