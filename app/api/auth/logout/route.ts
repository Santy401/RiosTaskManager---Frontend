import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful'
    });

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