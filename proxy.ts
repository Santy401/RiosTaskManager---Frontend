import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const protectedRoutes = ['/ui/pages/Dashboard', '/ui/pages/Dashboard/Admin', '/ui/pages/Dashboard/User', '/api/admin', '/api/user', '/'];
  const isLoggedIn = request.cookies.get('auth-token');
  const pathname = request.nextUrl.pathname;

  console.log('🔐 Cookies disponibles:', request.cookies.getAll());
  console.log('🔑 Token encontrado:', !!isLoggedIn);
  console.log('📍 Ruta actual:', pathname);

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    console.log('✅ Ruta pública, acceso permitido');
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    console.log('🚫 No hay token, redirigiendo al login');
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const loginUrl = new URL('/ui/pages/Login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/') {
    console.log('🏠 Redirigiendo ruta raíz al dashboard');
    return NextResponse.redirect(new URL('/ui/pages/Dashboard', request.url));
  }

  console.log('✅ Acceso permitido a ruta protegida:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/ui/pages/Dashboard/Admin/:path*',
    '/ui/pages/Dashboard/User/:path*',
    '/ui/pages/Dashboard/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/'  
  ]
};