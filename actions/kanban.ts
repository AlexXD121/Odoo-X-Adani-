'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { verifySession } from "@/lib/session";

// Fetch Real Authenticated User
async function getCurrentUser() {
    const session = await verifySession();

    if (!session || typeof session.userId !== 'string') {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            role: true,
            teamId: true,
            name: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export type KanbanBoardData = {
    new: any[];
    in_progress: any[];
    repaired: any[];
    scrap: any[];
};

export async function getKanbanBoard() {
    const user = await getCurrentUser();

    let whereClause: any = {};

    // 1. Team Visibility Logic
    if (user.role !== 'admin' && user.role !== 'manager') {
        if (user.teamId) {
            whereClause.assignedTeamId = user.teamId;
        } else {
            // Safety: If tech has no team, maybe return nothing or specific assignments?
            // For now, let's return assigned to him directly or empty.
            // Following prompt: "If User has no team: Return empty or all (decide based on safety)"
            // Returning empty is safer.
            return {
                new: [],
                in_progress: [],
                repaired: [],
                scrap: []
            };
        }
    }

    // 2. Fetch Requests
    const requests = await db.maintenanceRequest.findMany({
        where: whereClause,
        include: {
            equipment: true,
            assignedTo: true,
            assignedTeam: true,
        },
        orderBy: {
            updatedAt: 'desc',
        }
    });

    // 3. Group by Status
    // Mapping DB status to Columns:
    // 'pending' -> 'new'
    // 'in_progress' -> 'in_progress'
    // 'repaired' -> 'repaired'
    // 'scrap' -> 'scrap'

    const board: KanbanBoardData = {
        new: [],
        in_progress: [],
        repaired: [],
        scrap: []
    };

    requests.forEach((req: any) => {
        const status = req.status;
        if (status === 'pending' || status === 'new') {
            board.new.push(req);
        } else if (status === 'in_progress') {
            board.in_progress.push(req);
        } else if (status === 'repaired' || status === 'completed') {
            // Handling 'completed' as 'repaired' for backward compatibility if any
            board.repaired.push(req);
        } else if (status === 'scrap') {
            board.scrap.push(req);
        } else {
            // Fallback for unknown statuses, maybe put in new?
            board.new.push(req);
        }
    });

    return board;
}

export async function updateRequestStage(requestId: string, newStage: string) {
    // newStage comes in as column ID: 'new', 'in_progress', 'repaired', 'scrap'

    // Map Column ID to DB Status
    let dbStatus = 'new';
    if (newStage === 'in_progress') dbStatus = 'in_progress';
    if (newStage === 'repaired') dbStatus = 'repaired';
    if (newStage === 'scrap') dbStatus = 'scrap';
    if (newStage === 'new') dbStatus = 'new';

    // Fetch current request to get equipmentId
    const currentRequest = await db.maintenanceRequest.findUnique({
        where: { id: requestId },
        include: { equipment: true }
    });

    if (!currentRequest) {
        throw new Error("Request not found");
    }

    // SECURITY CHECK: Enforce team-based access control
    const currentUser = await getCurrentUser();

    // If user is a technician (not admin/manager), verify they can only move their team's tickets
    if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
        if (currentUser.teamId !== currentRequest.assignedTeamId) {
            throw new Error("Unauthorized: You can only move tickets assigned to your team.");
        }
    }

    // 1. Update Request Status
    await db.maintenanceRequest.update({
        where: { id: requestId },
        data: { status: dbStatus }
    });

    // 2. Critical Business Logic (Equipment Status Updates)
    const equipmentId = currentRequest.equipmentId;

    if (newStage === 'scrap') {
        // Find linked Equipment and update to "scrapped"
        await db.equipment.update({
            where: { id: equipmentId },
            data: { status: 'scrapped' }
        });
    }
    else if (newStage === 'repaired') {
        // Update to "operational" if it was previously "breakdown"
        // Checking current status of equipment might be good, 
        // but prompt implies checking if *it was previously breakdown*.
        // If we simply restore it to operational, it covers the requirement.
        // Let's check strictly if we want to avoid overwriting 'scrapped' or something else, 
        // but usually 'repaired' implies the machine is fixed.
        // Prompt: "if it was previously breakdown".

        // Let's read the equipment status from the fetched request
        if (currentRequest.equipment.status === 'breakdown' || currentRequest.equipment.status === 'maintenance') {
            await db.equipment.update({
                where: { id: equipmentId },
                data: { status: 'operational' }
            });
        }
    }
    else if (newStage === 'in_progress') {
        // Update Equipment to "maintenance"
        await db.equipment.update({
            where: { id: equipmentId },
            data: { status: 'maintenance' }
        });
    }

    revalidatePath('/dashboard/kanban');
    return { success: true };
}
