require('dotenv').config();


const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Example: fetch all users from the existing DB
  const users = await prisma.user.findMany();
  console.log('Fetched users:', users);

  // You can add more demo queries here, e.g., list canteen items
  // const items = await prisma.canteenItem.findMany();
  // console.log('Canteen items:', items);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });