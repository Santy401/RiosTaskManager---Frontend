// app/lib/users.ts o donde tengas tu lógica de base de datos
import { prisma } from './prisma'; // Ajusta según tu ORM/DB

export async function getRealUsers() {
  try {
    // Ejemplo con Prisma
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Excluir campos sensibles como password
        // Agrega otros campos que necesites
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