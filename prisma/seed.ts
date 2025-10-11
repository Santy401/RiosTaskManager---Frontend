import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default admin user
    const adminEmail = 'admin@rios.com';
    const adminPassword = 'admin123'; // You can change this password

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('🆔 User ID:', adminUser.id);
    console.log('\n🎉 You can now login with:');
    console.log('   Email: admin@rios.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('\n💡 Make sure your database is running and DATABASE_URL is set in .env');
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('💥 Unexpected error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
