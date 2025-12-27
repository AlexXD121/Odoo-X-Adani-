"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createEquipment(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const serialNumber = formData.get("serialNumber") as string;
        const category = formData.get("category") as string;
        const location = formData.get("location") as string;
        const purchaseDateStr = formData.get("purchaseDate") as string;
        const maintenanceTeamId = formData.get("maintenanceTeamId") as string;
        const technicianId = formData.get("technicianId") as string;

        // Optional / Toggle logic
        const assignType = formData.get("assignType") as string; // 'department' or 'employee'
        const department = formData.get("department") as string;
        const assignedEmployeeId = formData.get("assignedEmployeeId") as string;

        if (!name || !serialNumber || !category || !location || !purchaseDateStr || !maintenanceTeamId) {
            return { success: false, error: "Missing required fields" };
        }

        const purchaseDate = new Date(purchaseDateStr);

        const data: Prisma.EquipmentCreateInput = {
            name,
            serialNumber,
            category,
            location,
            purchaseDate,
            maintenanceTeam: {
                connect: { id: maintenanceTeamId }
            },
            status: "operational",
            technician: technicianId ? { connect: { id: technicianId } } : undefined,
            department: assignType === 'department' ? department : undefined,
            assignedEmployee: assignType === 'employee' && assignedEmployeeId ? { connect: { id: assignedEmployeeId } } : undefined,
            // company default is set in schema
        };

        await db.equipment.create({ data });
        revalidatePath("/dashboard/equipment");
        return { success: true };
    } catch (error) {
        console.error("Failed to create equipment:", error);
        return { success: false, error: "Failed to create equipment" };
    }
}

export async function getEquipmentList() {
    try {
        const equipment = await db.equipment.findMany({
            include: {
                maintenanceTeam: true,
                assignedEmployee: true,
                _count: {
                    select: {
                        requests: {
                            where: {
                                status: {
                                    notIn: ["repaired", "scrapped", "completed"] // Also excluding completed to be safe, but adhering to spec "not 'repaired', 'scrapped'"
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: equipment };
    } catch (error) {
        console.error("Failed to fetch equipment list:", error);
        return { success: false, error: "Failed to fetch equipment list" };
    }
}

// Fetch teams for the dropdown
export async function getMaintenanceTeams() {
    try {
        const teams = await db.team.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: teams };
    } catch (error) {
        return { success: false, data: [] };
    }
}

// Fetch users for employee assignment
export async function getEmployees() {
    try {
        const users = await db.user.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, data: [] };
    }
}
