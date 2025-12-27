const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.maintenanceRequest.deleteMany()
    await prisma.equipment.deleteMany()
    await prisma.user.deleteMany()
    await prisma.team.deleteMany()

    console.log('Seeding data...')

    // Create Teams
    const alphaSquad = await prisma.team.create({
        data: {
            name: 'Alpha Squad',
            companyName: 'GearGuard Inc.'
        }
    })

    const betaSquad = await prisma.team.create({
        data: {
            name: 'Beta Squad',
            companyName: 'GearGuard Inc.'
        }
    })

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@gearguard.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin'
        }
    })

    // CRITICAL: Technician Bob assigned to Alpha Squad
    const technicianBob = await prisma.user.create({
        data: {
            email: 'bob@gear.com',
            password: hashedPassword,
            name: 'Technician Bob',
            role: 'technician',
            teamId: alphaSquad.id
        }
    })

    // Additional technician for Beta Squad
    const technicianAlice = await prisma.user.create({
        data: {
            email: 'alice@gear.com',
            password: hashedPassword,
            name: 'Technician Alice',
            role: 'technician',
            teamId: betaSquad.id
        }
    })

    // Create Equipment
    const drill = await prisma.equipment.create({
        data: {
            name: 'Industrial Drill Press X200',
            serialNumber: 'DRL-2024-001',
            category: 'Heavy Machinery',
            department: 'Production',
            maintenanceTeamId: alphaSquad.id,
            location: 'Workshop A',
            purchaseDate: new Date('2022-01-15'),
            warrantyEnd: new Date('2025-01-15'),
            status: 'operational',
            technicianId: technicianBob.id
        }
    })

    const conveyor = await prisma.equipment.create({
        data: {
            name: 'Conveyor Belt System CB-500',
            serialNumber: 'CNV-2024-002',
            category: 'Logistics',
            department: 'Warehouse',
            maintenanceTeamId: alphaSquad.id,
            location: 'Warehouse B',
            purchaseDate: new Date('2021-06-10'),
            status: 'maintenance',
            technicianId: technicianBob.id
        }
    })

    const generator = await prisma.equipment.create({
        data: {
            name: 'Backup Generator GEN-3000',
            serialNumber: 'GEN-2024-003',
            category: 'Power Systems',
            department: 'Facilities',
            maintenanceTeamId: betaSquad.id,
            location: 'Building C',
            purchaseDate: new Date('2023-03-20'),
            warrantyEnd: new Date('2026-03-20'),
            status: 'operational'
        }
    })

    const compressor = await prisma.equipment.create({
        data: {
            name: 'Air Compressor AC-750',
            serialNumber: 'CMP-2024-004',
            category: 'Heavy Machinery',
            department: 'Production',
            maintenanceTeamId: alphaSquad.id,
            location: 'Workshop A',
            purchaseDate: new Date('2020-11-05'),
            status: 'breakdown'
        }
    })

    const hvac = await prisma.equipment.create({
        data: {
            name: 'HVAC System Unit 5',
            serialNumber: 'HVAC-2024-005',
            category: 'Climate Control',
            department: 'Facilities',
            maintenanceTeamId: betaSquad.id,
            location: 'Building A',
            purchaseDate: new Date('2019-08-12'),
            status: 'operational'
        }
    })

    // Scenario A: CNC Machine (For Scrap Logic Test)
    const cnc = await prisma.equipment.create({
        data: {
            name: 'CNC Machine X1',
            serialNumber: 'CNC-2024-X1',
            category: 'Heavy Machinery',
            department: 'Production',
            maintenanceTeamId: alphaSquad.id,
            location: 'Factory Floor 1',
            purchaseDate: new Date('2023-01-01'),
            status: 'operational'
        }
    })

    // Scenario B: Printer (For Preventive Calendar Test)
    const printer = await prisma.equipment.create({
        data: {
            name: 'Office Printer P-500',
            serialNumber: 'PRT-2024-001',
            category: 'Electronics',
            department: 'Office',
            maintenanceTeamId: betaSquad.id,
            location: 'Main Office',
            purchaseDate: new Date('2024-01-01'),
            status: 'operational'
        }
    })

    // Create Maintenance Requests with varied statuses and priorities
    await prisma.maintenanceRequest.create({
        data: {
            title: 'Drill Bit Replacement',
            description: 'Regular wear and tear replacement needed for primary drill bit.',
            priority: 'medium',
            status: 'new',
            type: 'preventive',
            equipmentId: drill.id,
            assignedToId: technicianBob.id,
            assignedTeamId: alphaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 3))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Belt Alignment Issue',
            description: 'Conveyor belt is drifting to the left, causing product misalignment.',
            priority: 'high',
            status: 'in_progress',
            type: 'corrective',
            equipmentId: conveyor.id,
            assignedToId: technicianBob.id,
            assignedTeamId: alphaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Generator Monthly Inspection',
            description: 'Routine monthly inspection and oil level check.',
            priority: 'low',
            status: 'new',
            type: 'preventive',
            equipmentId: generator.id,
            assignedTeamId: betaSquad.id,
            scheduledDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Compressor Pressure Leak',
            description: 'Critical pressure leak detected in main valve assembly.',
            priority: 'critical',
            status: 'new',
            type: 'corrective',
            equipmentId: compressor.id,
            assignedTeamId: alphaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'HVAC Filter Replacement',
            description: 'Quarterly filter replacement for optimal air quality.',
            priority: 'medium',
            status: 'repaired',
            type: 'preventive',
            equipmentId: hvac.id,
            assignedTeamId: betaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() - 2))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Conveyor Motor Overhaul',
            description: 'Complete motor overhaul completed successfully.',
            priority: 'high',
            status: 'repaired',
            type: 'corrective',
            equipmentId: conveyor.id,
            assignedToId: technicianBob.id,
            assignedTeamId: alphaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() - 5))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Drill Calibration',
            description: 'Precision calibration for improved accuracy.',
            priority: 'low',
            status: 'in_progress',
            type: 'preventive',
            equipmentId: drill.id,
            assignedToId: technicianBob.id,
            assignedTeamId: alphaSquad.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 2))
        }
    })

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Generator Fuel System Check',
            description: 'Annual fuel system inspection and cleaning.',
            priority: 'medium',
            status: 'new',
            type: 'preventive',
            equipmentId: generator.id,
            assignedTeamId: betaSquad.id,
            scheduledDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        }
    })

    // Scenario A Request
    await prisma.maintenanceRequest.create({
        data: {
            title: 'CNC Critical Failure',
            description: 'Main spindle crack. Evaluate for scrap.',
            priority: 'critical',
            status: 'new', // Logic test: Move this to Scrap -> Check Equipment Status
            type: 'corrective',
            equipmentId: cnc.id,
            assignedTeamId: alphaSquad.id
        }
    })

    // Scenario B Request
    const nextFriday = new Date()
    nextFriday.setDate(nextFriday.getDate() + (12 - nextFriday.getDay()) % 7) // Simple approximation or just +3 days
    if (nextFriday < new Date()) nextFriday.setDate(nextFriday.getDate() + 7)

    await prisma.maintenanceRequest.create({
        data: {
            title: 'Printer Toner Check',
            description: 'Regular toner check and cleaning.',
            priority: 'low',
            status: 'new',
            type: 'preventive',
            equipmentId: printer.id,
            assignedTeamId: betaSquad.id,
            scheduledDate: nextFriday,
            dueDate: nextFriday
        }
    })

    console.log('✅ Seeding completed successfully!')
    console.log('📊 Created:')
    console.log('  - 2 Teams (Alpha Squad, Beta Squad)')
    console.log('  - 3 Users (Admin, Technician Bob, Technician Alice)')
    console.log('  - 5 Equipment items')
    console.log('  - 8 Maintenance Requests')
    console.log('\n🔐 Login credentials:')
    console.log('  Admin: admin@gearguard.com / password123')
    console.log('  Technician Bob (Alpha Squad): bob@gear.com / password123')
    console.log('  Technician Alice (Beta Squad): alice@gear.com / password123')
    console.log('\n🎯 RBAC Test:')
    console.log('  - Bob should see 5 requests (Alpha Squad only)')
    console.log('  - Alice should see 3 requests (Beta Squad only)')
    console.log('  - Admin should see all 8 requests')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
