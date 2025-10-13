import { prisma } from './prisma';

export async function getRealUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  } catch (error) {
    console.error('Error obteniendo usuarios de la DB:', error);
    throw error;
  }
}

export async function createUsers(userData: {
  email: string;
  password: string;
  name?: string;
  role?: string;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return newUser;
  } catch (error) {
    console.log('Error al crear Usuario en la DB:', error)
    throw error;
  }
}

export async function checkIfUserExists(email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      }
    });

    return existingUser;
  } catch (error) {
    console.error('Error verificando usuario:', error);
    throw error;
  }
}