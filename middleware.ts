import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/ui/pages/Dashboard', '/ui/pages/Dashboard/Admin', '/ui/pages/Dashboard/User', '/api/admin', '/api/user'];
  
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // DEBUG: Ver todas las cookies
  console.log('🔐 Cookies disponibles:', request.cookies.getAll());
  
  const authToken = request.cookies.get('auth-token')?.value;
  console.log('🔑 auth-token encontrado:', !!authToken);

  if (!authToken) {
    console.log('🚫 No hay auth-token, redirigiendo al login');
    
    // Para rutas de API, devolver error JSON
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Para rutas de UI, redirigir al login
    const loginUrl = new URL('/ui/pages/Login', request.url); // ← Verifica esta ruta
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log('✅ Acceso permitido a:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/ui/pages/Dashboard/Admin/:path*',
    '/ui/pages/Dashboard/User/:path*',
    '/ui/pages/Dashboard/:path*',
    '/api/admin/:path*',
    '/api/user/:path*'  
  ]
};