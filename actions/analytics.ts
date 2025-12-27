'use server';

import { db } from "@/lib/db";

export type AnalyticsData = {
    total: number;
    completed: number;
    byStatus: Array<{ name: string; count: number }>;
    byPriority: Array<{ name: string; count: number }>;
    byType: Array<{ name: string; count: number }>;
    byTeam: Array<{ name: string; count: number }>;
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
    // Fetch all maintenance requests
    const allRequests = await db.maintenanceRequest.findMany({
        select: {
            status: true,
            priority: true,
            type: true,
            assignedTeamId: true
        }
    });

    // Count total requests
    const total = allRequests.length;

    // Count completed/repaired requests
    const completed = allRequests.filter(
        (req: any) => req.status === 'repaired' || req.status === 'completed'
    ).length;

    // Group by status
    const statusCounts: Record<string, number> = {};
    allRequests.forEach((req: any) => {
        const status = req.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Map status to friendly names
    const statusMapping: Record<string, string> = {
        'new': 'New',
        'pending': 'New',
        'in_progress': 'In Progress',
        'repaired': 'Repaired',
        'completed': 'Repaired',
        'scrap': 'Scrap'
    };

    const byStatus = Object.entries(statusCounts).map(([status, count]) => ({
        name: statusMapping[status] || status,
        count
    }));

    // Group by priority
    const priorityCounts: Record<string, number> = {};
    allRequests.forEach((req: any) => {
        const priority = req.priority;
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });

    // Map priority to friendly names
    const priorityMapping: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'critical': 'Critical'
    };

    const byPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
        name: priorityMapping[priority] || priority,
        count
    }));

    // Group by type (Breakdown/Corrective vs Preventive)
    const typeCounts: Record<string, number> = {};
    allRequests.forEach((req: any) => {
        const type = req.type || 'corrective';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const byType = Object.entries(typeCounts).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        count
    }));

    // Group by Team ID
    const teamCounts: Record<string, number> = {};
    allRequests.forEach((req: any) => {
        // Count by Team ID first
        if (req.assignedTeamId) {
            teamCounts[req.assignedTeamId] = (teamCounts[req.assignedTeamId] || 0) + 1;
        } else {
            teamCounts['Unassigned'] = (teamCounts['Unassigned'] || 0) + 1;
        }
    });

    // We need team names. Since this is a hackathon project, let's just fetch all teams to map names.
    const teams = await db.team.findMany();
    const teamMap = new Map(teams.map((t: any) => [t.id, t.name]));

    const byTeam = Object.entries(teamCounts).map(([teamId, count]) => ({
        name: (teamMap.get(teamId) || (teamId === 'Unassigned' ? 'Unassigned' : 'Unknown')) as string,
        count
    }));

    return {
        total,
        completed,
        byStatus,
        byPriority,
        byType,
        byTeam
    };
}
