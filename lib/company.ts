import { prisma } from "./prisma";

export async function getAllCompay() {
    try {
        const companys = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                nit: true,
                email: true,
                dian: true,
                firma: true,
                usuario: true,
                servidorCorreo: true,
                tipo: true,
                contraseña: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return companys;
    } catch(error) {
        console.error('error obtener empresas de la DB:', error)
        throw error;
    }
}

export async function createCompany(companyData: {
  name: string;
  nit: string;
  email: string;
  dian: string;
  firma: string;
  usuario: string;
  contraseña: string;
  servidorCorreo: string;
  tipo: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  try {
    const newCompany = await prisma.company.create({
      data: companyData,
      select: {
        id: true,
        name: true,
        nit: true,
        email: true,
        dian: true,
        firma: true,
        usuario: true,
        contraseña: true,
        servidorCorreo: true,
        tipo: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return newCompany;
  } catch (error) {
    console.error('Error creando empresa en la DB:', error);
    throw error;
  }
}