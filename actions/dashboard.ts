"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
    try {
        const [criticalEquipment, technicianLoad, openRequests, overdueRequests, recentActivity] = await Promise.all([
            // 1. Critical Equipment (breakdown or maintenance)
            db.equipment.count({
                where: {
                    status: { in: ["breakdown", "maintenance"] },
                },
            }),

            // 2. Technician Load (in-progress requests)
            db.maintenanceRequest.count({
                where: {
                    status: "in-progress",
                },
            }),

            // 3. Open Requests (not completed)
            db.maintenanceRequest.count({
                where: {
                    status: { not: "completed" },
                },
            }),

            // 4. Overdue Requests
            db.maintenanceRequest.count({
                where: {
                    status: { not: "completed" },
                    dueDate: { lt: new Date() },
                },
            }),

            // 5. Recent Activity
            db.maintenanceRequest.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    equipment: true,
                    assignedTo: true,
                },
            }),
        ]);

        return {
            success: true,
            data: {
                criticalEquipment,
                technicianLoad,
                openRequests,
                overdueRequests,
                recentActivity,
            },
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { success: false, error: "Failed to fetch dashboard stats" };
    }
}
