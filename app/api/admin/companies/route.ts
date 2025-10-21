import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { getAllCompany, createCompany, deleteCompany } from "@/lib/company";

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    const companies = await getAllCompany();

    return NextResponse.json(companies);

  } catch (error) {
    console.error('Error en /api/admin/companies:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    const body = await request.json();
    const { name, tipo, nit, cedula, dian, firma, softwareContable, usuario, contraseña, servidorCorreo, email, claveCorreo, claveCC, claveSS, claveICA } = body;

    if (!name || !nit || !email) {
      return NextResponse.json({ error: 'Nombre, NIT y email son requeridos' }, { status: 400 });
    }

    // const existingCompany = await checkIfCompanyExists(nit, email);
    // if (existingCompany) {
    //   return NextResponse.json({ error: 'Ya existe una empresa con este NIT o email' }, { status: 409 });
    // }

    const newCompany = await createCompany({
      name,
      tipo,
      nit,
      cedula,
      dian,
      firma,
      softwareContable,
      usuario,
      contraseña,
      servidorCorreo,
      email,
      claveCorreo,
      claveCC,
      claveSS,
      claveICA
    });

    console.log('✅ Empresa creada exitosamente:', newCompany.id);

    return NextResponse.json({
      success: true,
      message: 'Empresa creada exitosamente',
      company: newCompany
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/admin/companies:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json({ error: 'Ya existe una empresa con este NIT o email' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}