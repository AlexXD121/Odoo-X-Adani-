"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MaintenanceRequest, Prisma } from "@prisma/client";

export async function getRequestById(id: string) {
    try {
        const request = await db.maintenanceRequest.findUnique({
            where: { id },
            include: {
                equipment: true,
                assignedTo: true,
                assignedTeam: true,
            },
        });
        return { success: true, data: request };
    } catch (error) {
        console.error("Failed to fetch request:", error);
        return { success: false, error: "Failed to fetch request" };
    }
}

export async function getRequests(query?: string) {
    try {
        const whereClause: Prisma.MaintenanceRequestWhereInput = query
            ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { id: { contains: query, mode: 'insensitive' } },
                    { equipment: { name: { contains: query, mode: 'insensitive' } } },
                    { assignedTo: { name: { contains: query, mode: 'insensitive' } } },
                ],
            }
            : {};

        const requests = await db.maintenanceRequest.findMany({
            where: whereClause,
            include: {
                equipment: true,
                assignedTo: true,
                assignedTeam: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        return { success: true, data: requests };
    } catch (error) {
        console.error("Failed to fetch requests:", error);
        return { success: false, error: "Failed to fetch requests" };
    }
}

export async function updateRequestStatus(id: string, status: string) {
    try {
        await db.maintenanceRequest.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/dashboard/requests");
        return { success: true };
    } catch (error) {
        console.error("Failed to update request status:", error);
        return { success: false, error: "Failed to update request status" };
    }
}

export async function createRequest(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const equipmentId = formData.get("equipmentId") as string;
        const priority = formData.get("priority") as string;
        const description = formData.get("description") as string;
        const scheduledDate = formData.get("scheduledDate") as string;
        const type = formData.get("type") as string;

        // "Magic" auto-fill fields coming from the client
        const assignedTeamId = formData.get("assignedTeamId") as string;
        const assignedToId = formData.get("assignedToId") as string;

        await db.maintenanceRequest.create({
            data: {
                title,
                equipmentId,
                priority,
                description,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
                status: "new", // Explicitly 'new' per requirement badge, though schema default is 'pending'
                type: type || "corrective",
                assignedTeamId: assignedTeamId || undefined,
                assignedToId: assignedToId || undefined,
            }
        });

        revalidatePath("/dashboard/requests");
        return { success: true };
    } catch (error) {
        console.error("Failed to create request:", error);
        return { success: false, error: "Failed to create request" };
    }
}

// Fetch equipment details for the "Magic" auto-fill
export async function getEquipmentDetails(id: string) {
    try {
        const equipment = await db.equipment.findUnique({
            where: { id },
            include: {
                maintenanceTeam: true,
                technician: true, // This is the 'default technician'
            }
        });
        return { success: true, data: equipment };
    } catch (error) {
        return { success: false, error: "Failed to fetch equipment details" };
    }
}
