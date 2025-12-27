"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getWorkCenters() {
    try {
        const workCenters = await db.workCenter.findMany({
            include: {
                equipment: true
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: workCenters };
    } catch (error) {
        console.error("Failed to fetch work centers:", error);
        return { success: false, error: "Failed to fetch work centers" };
    }
}

export async function createWorkCenter(data: {
    name: string;
    code: string;
    costPerHour?: number;
    capacity?: number;
    timeEfficiency?: number;
    oeeTarget?: number;
}) {
    try {
        const wc = await db.workCenter.create({
            data: {
                name: data.name,
                code: data.code,
                costPerHour: data.costPerHour || 0,
                capacity: data.capacity || 100,
                timeEfficiency: data.timeEfficiency || 100,
                oeeTarget: data.oeeTarget || 90,
            }
        });
        revalidatePath("/dashboard/work-centers");
        revalidatePath("/dashboard/equipment");
        return { success: true, data: wc };
    } catch (error) {
        console.error("Failed to create work center:", error);
        return { success: false, error: "Failed to create work center" };
    }
}

export async function getWorkCenterById(id: string) {
    try {
        const wc = await db.workCenter.findUnique({
            where: { id },
            include: {
                equipment: true
            }
        });
        if (!wc) return { success: false, error: "Work center not found" };
        return { success: true, data: wc };
    } catch (error) {
        console.error("Failed to fetch work center:", error);
        return { success: false, error: "Failed to fetch work center" };
    }
}
