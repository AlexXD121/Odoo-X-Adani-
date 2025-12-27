import { getKanbanBoard } from "@/actions/kanban";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export default async function KanbanPage() {
    const boardData = await getKanbanBoard();

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Maintenance Board</h1>
                <p className="text-muted-foreground">
                    Prioritize tasks and track repair lifecycles.
                </p>
            </div>

            <KanbanBoard initialData={boardData} />
        </div>
    );
}
