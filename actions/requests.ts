"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MaintenanceRequest } from "@prisma/client";

export async function getRequests() {
    try {
        const requests = await db.maintenanceRequest.findMany({
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

        await db.maintenanceRequest.create({
            data: {
                title,
                equipmentId,
                priority,
                description,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
                status: "pending",
                type: "corrective" // Default
            }
        });

        revalidatePath("/dashboard/requests");
        return { success: true };
    } catch (error) {
        console.error("Failed to create request:", error);
        return { success: false, error: "Failed to create request" };
    }
}
