import { prisma } from "./prisma";

export async function getAllCompany() {
    try {
        const companys = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                tipo: true,
                nit: true,
                cedula: true,
                dian: true,
                firma: true,
                softwareContable: true,
                usuario: true,
                servidorCorreo: true,
                email: true,
                claveCorreo: true,
                claveCC: true,
                claveSS: true,
                claveICA: true,
                contraseña: true,
                createdAt: true,
                updatedAt: true,
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
  tipo: string;
  nit: string;
  cedula: string;
  dian: string;
  firma: string;
  softwareContable: string;
  usuario: string;
  servidorCorreo: string;
  email: string;
  claveCorreo: string;
  claveCC: string;
  claveSS: string;
  claveICA: string;
  contraseña: string;
}) {
  try {
    const newCompany = await prisma.company.create({
      data: companyData,
      select: {
        id: true,
        name: true,
        tipo: true,
        nit: true,
        cedula: true,
        dian: true,
        firma: true,
        softwareContable: true,
        usuario: true,
        servidorCorreo: true,
        email: true,
        claveCorreo: true,
        claveCC: true,
        claveSS: true,
        claveICA: true,
        contraseña: true,
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

export async function deleteCompany(id: string) {
    try {
    const deletedCompany = await prisma.company.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        tipo: true,
        nit: true,
        cedula: true,
        dian: true,
        firma: true,
        softwareContable: true,
        usuario: true,
        servidorCorreo: true,
        email: true,
        claveCorreo: true,
        claveCC: true,
        claveSS: true,
        claveICA: true,
        contraseña: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return deletedCompany;
  } catch (error) {
    console.error('Error eliminando empresa de la DB:', error);
    throw error;
  }
}

// Función adicional para verificar si la empresa existe
export async function checkIfCompanyExists(nit: string, email: string) {
  try {
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { nit: nit },
          { email: email }
        ]
      }
    });
    return existingCompany;
  } catch (error) {
    console.error('Error verificando empresa existente:', error);
    throw error;
  }
}