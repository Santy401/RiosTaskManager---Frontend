import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Crear la respuesta con NextResponse
    const response = NextResponse.json({
      message: 'Logout successful'
    });

    // Eliminar ambas cookies usando el método correcto de NextResponse
    response.cookies.delete('token');
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    return NextResponse.json({
      error: 'Error during logout'
    }, {
      status: 500,
    });
  }
}