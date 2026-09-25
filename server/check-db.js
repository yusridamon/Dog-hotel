const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== ROW COUNTS ===');
  console.log('admin_users:      ', await prisma.adminUser.count());
  console.log('customers:        ', await prisma.customer.count());
  console.log('dogs:             ', await prisma.dog.count());
  console.log('bookings:         ', await prisma.booking.count());
  console.log('kennels:          ', await prisma.kennel.count());
  console.log('services:         ', await prisma.service.count());
  console.log('facilities:       ', await prisma.facility.count());
  console.log('contact_messages: ', await prisma.contactMessage.count());

  console.log('\n=== ADMIN USERS ===');
  const admins = await prisma.adminUser.findMany({ select: { id: true, email: true, name: true, role: true } });
  admins.forEach(a => console.log(`  [${a.id}] ${a.name} | ${a.email} | role: ${a.role}`));

  console.log('\n=== KENNELS ===');
  const kennels = await prisma.kennel.findMany({ select: { id: true, name: true, size: true, isActive: true }, orderBy: { id: 'asc' } });
  kennels.forEach(k => console.log(`  [${k.id}] ${k.name} | size: ${k.size} | active: ${k.isActive}`));

  console.log('\n=== SERVICES ===');
  const services = await prisma.service.findMany({ select: { id: true, name: true, price: true }, orderBy: { sortOrder: 'asc' } });
  services.forEach(s => console.log(`  [${s.id}] ${s.name} | £${s.price}`));

  console.log('\n=== FACILITIES ===');
  const facilities = await prisma.facility.findMany({ select: { id: true, name: true }, orderBy: { sortOrder: 'asc' } });
  facilities.forEach(f => console.log(`  [${f.id}] ${f.name}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
