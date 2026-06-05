const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../config/db');
const dbClient = require('../database/dbClient');

const seedData = async () => {
  console.log('Connecting to database for seeding...');
  await connectDB();

  try {
    console.log('Clearing existing data...');
    // If Mongoose is active, we can run deleteMany
    // If JSON is active, the repository writeData([]) resets it
    if (typeof dbClient.users.readData === 'function') {
      dbClient.users.writeData([]);
      dbClient.employees.writeData([]);
      dbClient.clients.writeData([]);
      dbClient.projects.writeData([]);
      dbClient.tasks.writeData([]);
      dbClient.tickets.writeData([]);
    } else {
      await dbClient.users.deleteMany({});
      await dbClient.employees.deleteMany({});
      await dbClient.clients.deleteMany({});
      await dbClient.projects.deleteMany({});
      await dbClient.tasks.deleteMany({});
      await dbClient.tickets.deleteMany({});
    }

    console.log('Creating users...');
    
    // Hash password helper for JSON db
    const hash = async (pwd) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(pwd, salt);
    };

    // 1. Admins
    const adminUser = await dbClient.users.create({
      name: 'Executive Admin',
      email: 'admin@avon.com',
      password: await hash('admin123'),
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
    });

    // 2. Employees Users
    const rahulUser = await dbClient.users.create({
      name: 'Rahul Sharma',
      email: 'rahul@avon.com',
      password: await hash('employee123'),
      role: 'employee',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rahul'
    });

    const priyaUser = await dbClient.users.create({
      name: 'Priya Patel',
      email: 'priya@avon.com',
      password: await hash('employee123'),
      role: 'employee',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya'
    });

    const anilUser = await dbClient.users.create({
      name: 'Anil Kumar',
      email: 'anil@avon.com',
      password: await hash('employee123'),
      role: 'employee',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anil'
    });

    // 3. Clients Users
    const client1User = await dbClient.users.create({
      name: 'Karan Singh',
      email: 'client1@avon.com',
      password: await hash('client123'),
      role: 'client',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=techcorp'
    });

    const client2User = await dbClient.users.create({
      name: 'Suresh Rao',
      email: 'client2@avon.com',
      password: await hash('client123'),
      role: 'client',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=hydlogistics'
    });

    console.log('Creating employee and client profiles...');

    // 4. Employee Profiles
    const rahulProfile = await dbClient.employees.create({
      user: rahulUser._id || rahulUser.id,
      employeeId: 'AVN-2026-001',
      phone: '+91 98765 43210',
      department: 'Frontend',
      role: 'Senior React Developer',
      joiningDate: '2025-01-15T00:00:00.000Z',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'Framer Motion'],
      performanceRating: 4.8,
      attendanceRate: 98,
      taskCompletionRate: 95,
      status: 'Active'
    });

    const priyaProfile = await dbClient.employees.create({
      user: priyaUser._id || priyaUser.id,
      employeeId: 'AVN-2026-002',
      phone: '+91 87654 32109',
      department: 'Backend',
      role: 'Lead Node.js Engineer',
      joiningDate: '2024-06-10T00:00:00.000Z',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'JWT'],
      performanceRating: 4.6,
      attendanceRate: 96,
      taskCompletionRate: 92,
      status: 'Active'
    });

    const anilProfile = await dbClient.employees.create({
      user: anilUser._id || anilUser.id,
      employeeId: 'AVN-2026-003',
      phone: '+91 76543 21098',
      department: 'ERP/BaaN',
      role: 'ERP Solutions Consultant',
      joiningDate: '2024-11-01T00:00:00.000Z',
      skills: ['BaaN IV', 'Infor LN', 'ERP Integration', 'SQL Server', 'Crystal Reports'],
      performanceRating: 4.2,
      attendanceRate: 94,
      taskCompletionRate: 88,
      status: 'Active'
    });

    // 5. Client Profiles
    const client1Profile = await dbClient.clients.create({
      user: client1User._id || client1User.id,
      companyName: 'TechCorp India',
      contactPerson: 'Karan Singh',
      phone: '+91 99887 76655',
      industry: 'Financial Services',
      assignedService: 'CRM Services',
      projectStatus: 'Development',
      communicationNotes: [
        { note: 'Onboarded Client Karan Singh representing TechCorp India.', addedBy: 'System' },
        { note: 'Completed CRM discovery sprint; scope of customization finalized.', addedBy: 'Executive Admin' }
      ]
    });

    const client2Profile = await dbClient.clients.create({
      user: client2User._id || client2User.id,
      companyName: 'Hyderabad Logistics Pvt. Ltd.',
      contactPerson: 'Suresh Rao',
      phone: '+91 88776 65544',
      industry: 'Supply Chain & Transport',
      assignedService: 'ERP/BaaN Solutions',
      projectStatus: 'Discovery',
      communicationNotes: [
        { note: 'Onboarded Client Suresh Rao representing Hyderabad Logistics.', addedBy: 'System' },
        { note: 'Discussing migration of legacy BaaN IV tables to Infor LN.', addedBy: 'Executive Admin' }
      ]
    });

    console.log('Creating projects...');

    // 6. Projects
    const project1 = await dbClient.projects.create({
      name: 'TechCorp CRM Customization',
      description: 'Implementing custom CRM pipelines, sales analytics dashboards, and customer journey trackers for TechCorp.',
      projectType: 'CRM Projects',
      status: 'Development',
      progress: 65,
      startDate: '2026-04-01T00:00:00.000Z',
      endDate: '2026-08-30T00:00:00.000Z',
      client: client1User._id || client1User.id,
      team: [rahulUser._id || rahulUser.id, priyaUser._id || priyaUser.id],
      milestones: [
        { title: 'UI Mockups Approval', status: 'Completed', deadline: new Date('2026-04-20') },
        { title: 'Database & Pipeline Setup', status: 'Completed', deadline: new Date('2026-05-15') },
        { title: 'Sales Dashboard Integration', status: 'Pending', deadline: new Date('2026-06-30') },
        { title: 'UAT & Delivery', status: 'Pending', deadline: new Date('2026-08-15') }
      ]
    });

    const project2 = await dbClient.projects.create({
      name: 'Logistics ERP Migration',
      description: 'Upgrading Hyderabad Logistics database tables from BaaN IV to Infor CloudSuite and building standard reporting layouts.',
      projectType: 'ERP Projects',
      status: 'Development',
      progress: 40,
      startDate: '2026-05-01T00:00:00.000Z',
      endDate: '2026-10-30T00:00:00.000Z',
      client: client2User._id || client2User.id,
      team: [priyaUser._id || priyaUser.id, anilUser._id || anilUser.id],
      milestones: [
        { title: 'Schema Analysis', status: 'Completed', deadline: new Date('2026-05-20') },
        { title: 'Migration Mapping Script', status: 'Pending', deadline: new Date('2026-07-10') },
        { title: 'Reporting BI Tools setup', status: 'Pending', deadline: new Date('2026-09-01') }
      ]
    });

    const project3 = await dbClient.projects.create({
      name: 'Avon Internal Employee Portal',
      description: 'Designing the official internal employee and client portal system to govern task tracking and IT business operations.',
      projectType: 'Enterprise Portals',
      status: 'Development',
      progress: 90,
      startDate: '2026-05-10T00:00:00.000Z',
      endDate: '2026-06-25T00:00:00.000Z',
      client: adminUser._id || adminUser.id, // Owned by admin
      team: [rahulUser._id || rahulUser.id, priyaUser._id || priyaUser.id, anilUser._id || anilUser.id],
      milestones: [
        { title: 'API Specification Routing', status: 'Completed', deadline: new Date('2026-05-20') },
        { title: 'Dashboard Panels Design', status: 'Completed', deadline: new Date('2026-06-01') },
        { title: 'AI Assistant Integration', status: 'Completed', deadline: new Date('2026-06-10') },
        { title: 'Staging Testing & Launch', status: 'Pending', deadline: new Date('2026-06-20') }
      ]
    });

    console.log('Creating tasks...');

    // 7. Tasks
    await dbClient.tasks.create({
      title: 'Design CRM Analytics Page',
      description: 'Integrate Recharts and build layouts for displaying sales conversion and client growth pipelines.',
      project: project1._id || project1.id,
      assignedTo: rahulUser._id || rahulUser.id,
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-06-20T00:00:00.000Z',
      dailyUpdates: [
        { update: 'Setup grid and initialized basic Recharts area chart.', date: '2026-06-03T09:00:00.000Z' },
        { update: 'Connected mock analytics api response to the UI.', date: '2026-06-04T10:00:00.000Z' }
      ]
    });

    await dbClient.tasks.create({
      title: 'Build CRM Pipeline APIs',
      description: 'Write controllers and router mappings to fetch, update, and sort CRM deals based on deal values.',
      project: project1._id || project1.id,
      assignedTo: priyaUser._id || priyaUser.id,
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2026-06-18T00:00:00.000Z',
      dailyUpdates: [
        { update: 'Created mongoose task and routes definitions.', date: '2026-06-04T11:00:00.000Z' }
      ]
    });

    await dbClient.tasks.create({
      title: 'Database Table Mapping',
      description: 'Document current database tables and columns in BaaN and write scripts to map them to Mongo equivalents.',
      project: project2._id || project2.id,
      assignedTo: anilUser._id || anilUser.id,
      priority: 'High',
      status: 'Pending',
      dueDate: '2026-07-05T00:00:00.000Z',
      dailyUpdates: []
    });

    await dbClient.tasks.create({
      title: 'Integrate AI FAQ Assistant UI',
      description: 'Build a premium sliding/collapsible chatbot dashboard interface in the portal with suggested questions.',
      project: project3._id || project3.id,
      assignedTo: rahulUser._id || rahulUser.id,
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-06-08T00:00:00.000Z',
      dailyUpdates: [
        { update: 'Created floating chat component and state structures.', date: '2026-06-02T10:00:00.000Z' },
        { update: 'Polished layouts, chat animations, and implemented dark mode sync.', date: '2026-06-04T17:00:00.000Z' }
      ]
    });

    console.log('Creating support tickets...');

    // 8. Tickets
    await dbClient.tickets.create({
      ticketId: 'TKT-1490',
      title: 'Database Connection Timeout',
      description: 'The staging database drops connection every time we execute the report query. Getting service timeouts.',
      raisedBy: client1User._id || client1User.id,
      assignedTo: priyaUser._id || priyaUser.id,
      priority: 'Critical',
      status: 'Open',
      comments: [
        { sender: client1User._id || client1User.id, text: 'This is blocking our QA team. Please check the logs.' },
        { sender: priyaUser._id || priyaUser.id, text: 'Looking into this. It seems to be a connection pool size limitation. I will increase the pool size in db.js.' }
      ]
    });

    await dbClient.tickets.create({
      ticketId: 'TKT-2580',
      title: 'BaaN IV Table Export Error',
      description: 'Encountering error code 124 when trying to export table tfgld018 to csv for ERP migration verification.',
      raisedBy: client2User._id || client2User.id,
      assignedTo: anilUser._id || anilUser.id,
      priority: 'High',
      status: 'Pending',
      comments: [
        { sender: client2User._id || client2User.id, text: 'This happens only for tables exceeding 100k rows.' }
      ]
    });

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
