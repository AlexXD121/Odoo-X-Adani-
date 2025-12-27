'use server';

import { db } from "@/lib/db";

export type AnalyticsData = {
    total: number;
    completed: number;
    byStatus: Array<{ name: string; count: number }>;
    byPriority: Array<{ name: string; count: number }>;
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
    // Fetch all maintenance requests
    const allRequests = await db.maintenanceRequest.findMany({
        select: {
            status: true,
            priority: true,
        }
    });

    // Count total requests
    const total = allRequests.length;

    // Count completed/repaired requests
    const completed = allRequests.filter(
        req => req.status === 'repaired' || req.status === 'completed'
    ).length;

    // Group by status
    const statusCounts: Record<string, number> = {};
    allRequests.forEach(req => {
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
    allRequests.forEach(req => {
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

    return {
        total,
        completed,
        byStatus,
        byPriority
    };
}
