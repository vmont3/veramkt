
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToSuperAdmin(email: string) {
    try {
        console.log(`Searching for user with email: ${email}...`);
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('User not found!');
            return;
        }

        console.log(`User found: ${user.id} (${user.name}). Current role: ${user.role}`);

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'SUPER_ADMIN' },
        });

        console.log(`SUCCESS: User ${updatedUser.email} is now a ${updatedUser.role}`);
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute
promoteToSuperAdmin('vinny.mont3@gmail.com');
