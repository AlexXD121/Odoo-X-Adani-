"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTeams() {
    try {
        const teams = await db.team.findMany({
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { success: true, data: teams };
    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return { success: false, error: "Failed to fetch teams" };
    }
}

export async function createTeam(name: string, companyName: string) {
    try {
        if (!name || name.trim().length === 0) {
            return { success: false, error: "Team name is required" };
        }
        if (!companyName || companyName.trim().length === 0) {
            return { success: false, error: "Company name is required" };
        }

        const team = await db.team.create({
            data: {
                name,
                companyName,
            },
        });

        revalidatePath("/dashboard/teams");
        return { success: true, data: team };
    } catch (error) {
        console.error("Failed to create team:", error);
        return { success: false, error: "Failed to create team" };
    }
}

export async function getUnassignedUsers() {
    try {
        const users = await db.user.findMany({
            where: {
                teamId: null
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        return { success: true, data: users };
    } catch (error) {
        console.error("Failed to fetch unassigned users:", error);
        return { success: false, error: "Failed to fetch unassigned users" };
    }
}

export async function assignUserToTeam(userId: string, teamId: string) {
    try {
        await db.user.update({
            where: { id: userId },
            data: {
                teamId: teamId,
            },
        });

        revalidatePath("/dashboard/teams");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign user to team:", error);
        return { success: false, error: "Failed to assign user to team" };
    }
}
