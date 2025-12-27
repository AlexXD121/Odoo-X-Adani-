'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Badge } from 'lucide-react'; // Placeholder badge
// Note: Lucide doesn't export Badge, using basic div for now or importing Badge from shadcn if previously created. 
// I will use simple divs for now.

type Task = {
    id: string;
    title: string;
    status: string;
    priority: string;
};

const initialData: Task[] = [
    { id: '1', title: 'Fix Hydraulic Pump', status: 'backlog', priority: 'high' },
    { id: '2', title: 'Calibrate Sensors', status: 'in-progress', priority: 'medium' },
    { id: '3', title: 'Monthly Safety Check', status: 'completed', priority: 'low' },
];

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setTasks(initialData);
        setIsMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            // Moving between columns
            const sourceList = tasks.filter(t => t.status === source.droppableId);
            const destList = tasks.filter(t => t.status === destination.droppableId);
            const draggedItem = sourceList[source.index];

            // Update status logic would go here
            // For prototype, we just update local state
            const newTasks = tasks.map(t =>
                t.id === draggedItem.id ? { ...t, status: destination.droppableId } : t
            );
            setTasks(newTasks);
        } else {
            // Reordering in same column (omitted for simple prototype)
        }
    };

    if (!isMounted) return <div>Loading Board...</div>;

    const columns = ['backlog', 'in-progress', 'completed'];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-4 p-4 overflow-x-auto bg-gray-100 rounded-lg">
                {columns.map(columnId => (
                    <div key={columnId} className="flex-1 min-w-[300px] flex flex-col gap-4">
                        <h3 className="font-bold text-lg capitalize text-gray-700">{columnId.replace('-', ' ')}</h3>
                        <Droppable droppableId={columnId}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex-1 bg-white/50 p-4 rounded-lg shadow-inner"
                                >
                                    {tasks.filter(t => t.status === columnId).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mb-4"
                                                >
                                                    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                                        <CardHeader className="p-4 pb-2">
                                                            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-4 pt-0 text-xs text-gray-500">
                                                            Priority: {task.priority}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
