const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.maintenanceRequest.deleteMany()
    await prisma.equipment.deleteMany()
    await prisma.team.deleteMany()

    console.log('Seeding data...')

    // Create Equipment
    const drill = await prisma.equipment.create({
        data: {
            name: 'Industrial Drill Press X200',
            type: 'Machinery',
            status: 'operational',
            location: 'Workshop A',
        },
    })

    const conveyor = await prisma.equipment.create({
        data: {
            name: 'Conveyor Belt System',
            type: 'Logistics',
            status: 'maintenance',
            location: 'Warehouse B',
        },
    })

    // Create Requests
    await prisma.maintenanceRequest.create({
        data: {
            title: 'Drill Bit Replacement',
            description: 'Regular wear and tear replacement needed.',
            priority: 'medium',
            status: 'pending',
            equipmentId: drill.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
        },
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Belt Alignment Issue',
            description: 'Conveyor belt is drifting to the left.',
            priority: 'high',
            status: 'in-progress',
            equipmentId: conveyor.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // 1 day from now
        },
    })

    await prisma.team.create({
        data: {
            name: 'Alpha Squad',
            specialization: 'Mechanical',
        }
    })

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
