const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: 'admin@doghotel.com' } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: 'admin@doghotel.com',
        password: hashedPassword,
        name: 'Hotel Admin',
        role: 'admin',
      },
    });
  }
  console.log('Admin user: admin@doghotel.com / admin123');

  // Create 12 identical kennels named 1..12
  const kennelCount = await prisma.kennel.count();
  if (kennelCount === 0) {
    await prisma.kennel.createMany({
      data: Array.from({ length: 12 }, (_, i) => ({
        name: String(i + 1),
        description: 'Comfortable, secure kennel',
        size: 'STANDARD',
      })),
    });
    console.log('12 kennels created (1-12)');
  } else {
    console.log('Kennels already exist, skipping');
  }

  // Create services (only if none exist)
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        { name: 'Overnight Boarding', description: 'Safe, comfortable overnight stay for your dog with round-the-clock care, regular feeding, and playtime.', price: 250, icon: 'moon', sortOrder: 1 },
        { name: 'Doggy Day Care', description: 'A full day of supervised play and socialisation for your dog while you are at work.', price: 150, icon: 'sun', sortOrder: 2 },
        { name: 'Spacious Outdoor Play', description: 'Access to our large, fully-fenced outdoor play area where dogs can run and have fun.', price: 0, icon: 'award', sortOrder: 3 },
        { name: 'Individual Attention', description: 'One-on-one care and attention for every dog, tailored to their personality and needs.', price: 0, icon: 'heart', sortOrder: 4 },
      ],
    });
    console.log('Services created');
  } else {
    console.log('Services already exist, skipping');
  }

  // Create facilities (only if none exist)
  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    await prisma.facility.createMany({
      data: [
        { name: 'Spacious Outdoor Play Area', description: 'A large, fully-fenced grassy outdoor area where dogs can run, play and enjoy the Cape Town sunshine safely under supervision.', imageUrl: '/images/outdoor-play.jpg', sortOrder: 1 },
        { name: 'Home Environment', description: 'Not a cold kennel. A real home where dogs are treated like family, with cosy indoor spaces to relax and rest.', imageUrl: '/images/home.jpg', sortOrder: 2 },
        { name: 'Safe & Secure Property', description: 'Our Schaapkraal property is fully fenced and secure, giving you complete peace of mind while your dog stays with us.', imageUrl: '/images/secure.jpg', sortOrder: 3 },
        { name: 'Rest & Feeding Areas', description: 'Quiet, comfortable feeding and rest areas where dogs eat on a schedule matching their routine at home.', imageUrl: '/images/feeding.jpg', sortOrder: 4 },
        { name: 'Individual Care', description: 'Every dog receives personal one-on-one attention from Yusri and the team throughout their stay.', imageUrl: '/images/care.jpg', sortOrder: 5 },
      ],
    });
    console.log('Facilities created');
  } else {
    console.log('Facilities already exist, skipping');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
