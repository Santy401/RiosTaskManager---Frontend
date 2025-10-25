import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    message: 'Logout successful'
  });

  response.cookies.delete('token');
  response.cookies.delete('auth-token');

  return response;
}