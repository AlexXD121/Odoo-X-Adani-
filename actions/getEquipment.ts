'use server';

import { db } from '@/lib/db';

export async function getEquipment() {
    try {
        const equipment = await db.equipment.findMany({
            include: {
                workCenter: true,
                technician: true,
                maintenanceTeam: true,
                assignedEmployee: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return equipment;
    } catch (error) {
        console.error('Failed to fetch equipment:', error);
        return [];
    }

}

export async function getEquipmentById(id: string) {
    try {
        const item = await db.equipment.findUnique({
            where: { id },
            include: {
                workCenter: true,
                technician: true,
                maintenanceTeam: true,
                assignedEmployee: true
            },
        });
        if (!item) return { success: false, error: 'Equipment not found' };
        return { success: true, data: item };
    } catch (error) {
        console.error('Failed to fetch equipment by id:', error);
        return { success: false, error: 'Failed to fetch equipment' };
    }
}
