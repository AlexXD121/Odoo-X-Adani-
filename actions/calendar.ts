"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCalendarEvents() {
    try {
        // Fetch requests that have a scheduled date
        const requests = await db.maintenanceRequest.findMany({
            where: {
                scheduledDate: {
                    not: null
                },
                type: 'preventive'
            },
            include: {
                equipment: true,
                assignedTo: true
            }
        });

        // Map to Calendar Event format
        // React-Big-Calendar expects: { title, start, end, resource? }
        const events = requests.map((req: any) => {
            const start = new Date(req.scheduledDate!);
            // Default to 1 hour duration if not specified (though schema has default(1))
            const duration = req.duration || 1;
            const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

            return {
                id: req.id,
                title: `${req.equipment.name} - ${req.title}`,
                start: start,
                end: end,
                resource: {
                    priority: req.priority,
                    status: req.status,
                    type: req.type,
                    technician: req.assignedTo?.name || "Unassigned"
                }
            };
        });

        return { success: true, data: events };
    } catch (error) {
        console.error("Failed to fetch calendar events:", error);
        return { success: false, error: "Failed to load calendar" };
    }
}

export async function updateEventDate(eventId: string, newDate: Date) {
    try {
        await db.maintenanceRequest.update({
            where: { id: eventId },
            data: {
                scheduledDate: newDate
            }
        });
        revalidatePath("/dashboard/calendar");
        return { success: true };
    } catch (error) {
        console.error("Failed to update event date:", error);
        revalidatePath("/dashboard/calendar"); // Revalidate anyway to reset UI
        return { success: false, error: "Failed to move event" };
    }
}
