import { PrismaClient } from '@prisma/client';

console.log('Testing Prisma client...');

try {
  const prisma = new PrismaClient();
  console.log('Prisma client created successfully');
  
  // Test a simple query
  prisma.$connect()
    .then(() => {
      console.log('Connected to database');
      return prisma.user.findMany();
    })
    .then(users => {
      console.log('Users:', users);
    })
    .catch(err => {
      console.error('Database error:', err);
    })
    .finally(() => {
      prisma.$disconnect();
    });
} catch (error) {
  console.error('Error creating Prisma client:', error);
}