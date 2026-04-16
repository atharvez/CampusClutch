const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Competition = require('./models/Competition');
const Team = require('./models/Team');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusclutch');
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Competition.deleteMany();
    await Team.deleteMany();

    console.log('Data Cleared...');

    // Create Base Skills & Branches
    const branches = ['Computer Science', 'Electronic Engineering', 'Business Administration', 'Mechanical Engineering', 'Information Technology'];
    const skillsList = ['React', 'Node.js', 'Python', 'ML', 'UI/UX', 'Figma', 'Java', 'C++', 'Data Science', 'Marketing', 'Excel'];

    // 1. Create Host Users (Admins)
    const hosts = [];
    for (let i = 0; i < 3; i++) {
        const host = await User.create({
            name: `${faker.person.firstName()} (Official Host)`,
            email: `admin${i}@college.edu`,
            password: 'password123',
            branch: 'Institutional Relations',
            year: 'Staff',
            role: 'host',
            bio: 'Official campus event coordinator.',
        });
        hosts.push(host);
    }
    console.log('Hosts Created...');

    // 2. Create Student Users
    const students = [];
    for (let i = 0; i < 15; i++) {
      const student = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().split('@')[0] + '@college.edu',
        password: 'password123',
        branch: branches[Math.floor(Math.random() * branches.length)],
        year: `${Math.floor(Math.random() * 4) + 1}st Year`,
        role: 'student',
        skills: [
          skillsList[Math.floor(Math.random() * skillsList.length)],
          skillsList[Math.floor(Math.random() * skillsList.length)]
        ].filter((v, i, a) => a.indexOf(v) === i),
        bio: faker.lorem.paragraph(),
        portfolioLink: faker.internet.url(),
        githubLink: `https://github.com/${faker.internet.username()}`,
      });
      students.push(student);
    }
    console.log('Students Created...');

    // 3. Create Official Competitions (from Hosts)
    const officialComps = [];
    const officialTitles = ['Google Solution Challenge', 'MIT Hackathon 2024', 'NASA Space Apps'];
    for (let i = 0; i < officialTitles.length; i++) {
        const comp = await Competition.create({
            title: officialTitles[i],
            description: faker.lorem.sentences(4),
            category: 'Hackathon',
            teamSize: 4,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            requiredSkills: ['React', 'Node.js', 'Python'],
            creator: hosts[i % hosts.length]._id,
            isOfficial: true,
        });
        officialComps.push(comp);
    }
    console.log('Official Competitions Created...');

    // 4. Create Community Posts (Reddit-like, from Students)
    const communityPosts = [];
    const redditTitles = [
        'Anyone want to build a crypto app?',
        'Looking for a UI designer for my portfolio project',
        'Starting a study group for Advanced Algorithms',
        'IoT Plant Watering system - need Arduino expert'
    ];
    for (let i = 0; i < redditTitles.length; i++) {
        const post = await Competition.create({
            title: redditTitles[i],
            description: faker.lorem.sentences(2),
            category: 'Project',
            teamSize: Math.floor(Math.random() * 3) + 2,
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            requiredSkills: [skillsList[Math.floor(Math.random() * skillsList.length)]],
            creator: students[Math.floor(Math.random() * students.length)]._id,
            isOfficial: false,
            upvotes: Math.floor(Math.random() * 50) + 10,
        });
        communityPosts.push(post);
    }
    console.log('Community Posts Created...');

    // 5. Create Teams for Official Competitions
    for (let i = 0; i < 5; i++) {
        const comp = officialComps[Math.floor(Math.random() * officialComps.length)];
        const leader = students[Math.floor(Math.random() * students.length)];
        
        await Team.create({
            name: `${comp.title.split(' ')[0]} ${faker.commerce.productAdjective()} Squad`,
            description: faker.company.catchPhrase(),
            competition: comp._id,
            members: [
                { user: leader._id, role: 'Leader' }
            ],
            status: 'Open'
        });
    }

    console.log('Teams & Relations Seeded...');
    console.log('Database Seeded Successfully with Host & Community Data!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(seedData);
