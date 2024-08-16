import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);

  for (let i = 1; i <= 25; i++) {
    await prisma.user.create({
      data: {
        email: `user_${i}@example.com`,
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        password: await bcrypt.hash('password', salt),
        role: i === 1 ? 'admin' : 'user', // The first user will be an admin
        verified: true,
      },
    });
  }

  console.log('25 users have been created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
