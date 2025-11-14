import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nit = searchParams.get('nit');

    if (!nit) {
      return NextResponse.json(
        { error: 'NIT es requerido' },
        { status: 400 }
      );
    }

    // Normalizar el NIT (eliminar espacios y convertir a mayúsculas)
    const normalizedNit = nit.trim().toUpperCase();
    
    // Buscar empresa con el NIT proporcionado (insensible a mayúsculas/minúsculas y espacios)
    const existingCompany = await prisma.company.findFirst({
      where: {
        nit: {
          equals: normalizedNit,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        nit: true,
      },
    });
    
    // Si se encontró una empresa, verificar si el NIT coincide exactamente (incluyendo mayúsculas)
    const exactMatch = existingCompany && existingCompany.nit === normalizedNit;

    return NextResponse.json({
      exists: exactMatch,
    });

  } catch (error) {
    console.error('Error al verificar NIT:', error);
    return NextResponse.json(
      { error: 'Error al verificar el NIT' },
      { status: 500 }
    );
  }
}
