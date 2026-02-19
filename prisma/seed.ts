import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@datawellbeing.org' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@datawellbeing.org',
      password: adminPassword,
      name: process.env.DEFAULT_ADMIN_NAME || 'System Administrator',
      role: 'ADMIN',
      status: 'APPROVED',
      emailVerified: true,
      isPublic: false
    }
  });

  console.log('Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
