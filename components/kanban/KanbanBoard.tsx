'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent
} from '@dnd-kit/core';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import { updateRequestStage, KanbanBoardData } from '@/actions/kanban';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
    initialData: KanbanBoardData;
}

export default function KanbanBoard({ initialData }: KanbanBoardProps) {
    const [items, setItems] = useState<KanbanBoardData>(initialData);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        })
    );

    // Sync state if initialData changes (re-fetch)
    useEffect(() => {
        setItems(initialData);
    }, [initialData]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find source container
        const sourceContainer = findContainer(activeId);
        // Find destination container (it might be the column ID itself or an item inside it)
        let destContainer = findContainer(overId);

        // If dropped directly on a column (e.g. empty column), use that column ID
        if (Object.keys(items).includes(overId)) {
            destContainer = overId as keyof KanbanBoardData;
        }

        if (!sourceContainer || !destContainer || sourceContainer === destContainer) {
            return;
        }

        // Optimistic Update
        const activeItem = items[sourceContainer].find(i => i.id === activeId);

        if (!activeItem) return;

        setItems((prev) => {
            const sourceItems = [...prev[sourceContainer]];
            const destItems = [...prev[destContainer]];

            // Remove from source
            const itemIndex = sourceItems.findIndex(i => i.id === activeId);
            sourceItems.splice(itemIndex, 1);

            // Add to dest (append for now)
            // Ideally we insert at specific index but basic appending is fine for MVP columns
            destItems.push({
                ...activeItem,
                status: mapColumnToStatus(destContainer!) // Optimistic status update
            });

            return {
                ...prev,
                [sourceContainer]: sourceItems,
                [destContainer]: destItems
            };
        });

        // Server Action
        try {
            await updateRequestStage(activeId, destContainer);
            // Success (maybe show toast)
        } catch (error) {
            console.error("Failed to update stage:", error);
            // Revert state (Optional but recommended)
            setItems(initialData); // Brute force revert
            alert("Failed to move item. Please try again.");
        }
    };

    const findContainer = (id: string): keyof KanbanBoardData | undefined => {
        if (Object.keys(items).includes(id)) {
            return id as keyof KanbanBoardData;
        }

        for (const key of Object.keys(items)) {
            const k = key as keyof KanbanBoardData;
            if (items[k].find(i => i.id === id)) {
                return k;
            }
        }
        return undefined;
    };

    const mapColumnToStatus = (colId: string) => {
        if (colId === 'new') return 'pending';
        if (colId === 'in_progress') return 'in_progress';
        if (colId === 'repaired') return 'repaired';
        if (colId === 'scrap') return 'scrap';
        return 'pending';
    }

    // Colors for columns
    const requestColors = {
        new: "border-blue-500",
        in_progress: "border-orange-500",
        repaired: "border-green-500",
        scrap: "border-red-500"
    };

    const columnTitles = {
        new: "New Requests",
        in_progress: "In Progress",
        repaired: "Repaired",
        scrap: "Scrap"
    };

    // Find active item for Overlay
    const getActiveItem = () => {
        if (!activeId) return null;
        const container = findContainer(activeId);
        if (!container) return null;
        return items[container].find(i => i.id === activeId);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-140px)] gap-6 overflow-x-auto pb-4 items-start">
                {(Object.keys(items) as Array<keyof KanbanBoardData>).map((colId) => (
                    <div key={colId} className="h-full flex-shrink-0 w-80">
                        <BoardColumn
                            id={colId}
                            title={columnTitles[colId]}
                            count={items[colId].length}
                            color={requestColors[colId]}
                        >
                            {items[colId].map((req) => (
                                <TaskCard key={req.id} request={req} />
                            ))}
                        </BoardColumn>
                    </div>
                ))}
            </div>

            {createPortal(
                <DragOverlay>
                    {activeId ? (
                        <TaskCard request={getActiveItem()} />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
