'use server';

import { db } from '@/lib/db';

export async function getEquipment() {
    try {
        const equipment = await db.equipment.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return equipment;
    } catch (error) {
        console.error('Failed to fetch equipment:', error);
        return [];
    }
}
