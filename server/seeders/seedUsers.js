const { faker } = require('@faker-js/faker');
const User = require('../models/User');

const generateUsers = async (count = 20) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: 'Password@123', // Will be hashed by pre-save hook
      role: 'member',
      isVerified: true,
      isBlocked: false
    });
  }
  
  return users;
};

const seedUsers = async (count = 20) => {
  try {
    console.log(`🌱 Generating ${count} team members...`);
    const users = await generateUsers(count);
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} team members`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

module.exports = { seedUsers, generateUsers };
