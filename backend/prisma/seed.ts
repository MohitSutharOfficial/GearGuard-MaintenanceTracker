import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.maintenanceTeam.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gearguard.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'sarah.chen@gearguard.com',
      passwordHash: hashedPassword,
      fullName: 'Sarah Chen',
      role: 'MANAGER',
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john.martinez@gearguard.com',
      passwordHash: hashedPassword,
      fullName: 'John Martinez',
      role: 'TECHNICIAN',
    },
  });

  const mike = await prisma.user.create({
    data: {
      email: 'mike.wilson@gearguard.com',
      passwordHash: hashedPassword,
      fullName: 'Mike Wilson',
      role: 'TECHNICIAN',
    },
  });

  const lisa = await prisma.user.create({
    data: {
      email: 'lisa.chen@gearguard.com',
      passwordHash: hashedPassword,
      fullName: 'Lisa Chen',
      role: 'TECHNICIAN',
    },
  });

  console.log('✓ Created users');

  // Create Maintenance Teams
  const mechanicalTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'Mechanical Team',
      specialization: 'Heavy Machinery',
      description: 'Specializes in CNC machines, forklifts, and mechanical equipment',
      color: '#714B67',
    },
  });

  const electricalTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'Electrical Team',
      specialization: 'Electrical Systems',
      description: 'Handles electrical equipment and power systems',
      color: '#3b82f6',
    },
  });

  const hvacTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'HVAC Team',
      specialization: 'Climate Control',
      description: 'Maintains heating, ventilation, and air conditioning systems',
      color: '#22c55e',
    },
  });

  console.log('✓ Created maintenance teams');

  // Create Team Members
  await prisma.teamMember.createMany({
    data: [
      { teamId: mechanicalTeam.id, userId: john.id, role: 'LEAD' },
      { teamId: mechanicalTeam.id, userId: mike.id, role: 'MEMBER' },
      { teamId: mechanicalTeam.id, userId: lisa.id, role: 'MEMBER' },
      { teamId: electricalTeam.id, userId: mike.id, role: 'LEAD' },
      { teamId: hvacTeam.id, userId: lisa.id, role: 'LEAD' },
    ],
  });

  console.log('✓ Created team members');

  // Create Equipment
  const cnc001 = await prisma.equipment.create({
    data: {
      name: 'CNC-001',
      serialNumber: 'CNC-ML-2023-001',
      category: 'CNC Machine',
      department: 'Production',
      employee: 'Michael Johnson',
      purchaseDate: new Date('2023-01-15'),
      warrantyExpiry: new Date('2025-01-15'),
      location: 'Workshop A, Station 1',
      status: 'ACTIVE',
      maintenanceTeamId: mechanicalTeam.id,
    },
  });

  const cnc002 = await prisma.equipment.create({
    data: {
      name: 'CNC-002',
      serialNumber: 'CNC-ML-2023-002',
      category: 'CNC Machine',
      department: 'Production',
      employee: 'Robert Davis',
      purchaseDate: new Date('2023-03-20'),
      warrantyExpiry: new Date('2025-03-20'),
      location: 'Workshop A, Station 2',
      status: 'ACTIVE',
      maintenanceTeamId: mechanicalTeam.id,
    },
  });

  const forklift = await prisma.equipment.create({
    data: {
      name: 'Forklift-A01',
      serialNumber: 'FRK-2020-A01',
      category: 'Material Handling',
      department: 'Warehouse',
      employee: 'James Wilson',
      purchaseDate: new Date('2020-06-10'),
      warrantyExpiry: new Date('2023-06-10'),
      location: 'Warehouse Zone A',
      status: 'ACTIVE',
      maintenanceTeamId: mechanicalTeam.id,
    },
  });

  console.log('✓ Created equipment');

  // Create Maintenance Requests
  await prisma.maintenanceRequest.create({
    data: {
      subject: 'Routine Calibration - CNC-001',
      type: 'PREVENTIVE',
      equipmentId: cnc001.id,
      maintenanceTeamId: mechanicalTeam.id,
      stage: 'NEW',
      priority: 'MEDIUM',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      description: 'Scheduled quarterly calibration and inspection',
      createdBy: manager.id,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      subject: 'Spindle Motor Check - CNC-002',
      type: 'CORRECTIVE',
      equipmentId: cnc002.id,
      maintenanceTeamId: mechanicalTeam.id,
      stage: 'IN_PROGRESS',
      priority: 'HIGH',
      description: 'Unusual noise from spindle motor, needs immediate attention',
      technicianId: john.id,
      createdBy: manager.id,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      subject: 'Hydraulic Leak - Forklift-A01',
      type: 'CORRECTIVE',
      equipmentId: forklift.id,
      maintenanceTeamId: mechanicalTeam.id,
      stage: 'NEW',
      priority: 'URGENT',
      description: 'Hydraulic fluid leaking from lift cylinder',
      createdBy: manager.id,
    },
  });

  const completedRequest = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Belt Replacement - CNC-001',
      type: 'PREVENTIVE',
      equipmentId: cnc001.id,
      maintenanceTeamId: mechanicalTeam.id,
      stage: 'REPAIRED',
      priority: 'LOW',
      description: 'Scheduled belt replacement as per maintenance plan',
      duration: 4.5,
      technicianId: john.id,
      createdBy: manager.id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });

  console.log('✓ Created maintenance requests');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest Login Credentials:');
  console.log('------------------------');
  console.log('Admin:      admin@gearguard.com / password123');
  console.log('Manager:    sarah.chen@gearguard.com / password123');
  console.log('Technician: john.martinez@gearguard.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
