import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    role?: string;
    userId?: string;
    id?: string;
    email?: string;
}

export async function GET(request: Request): Promise<NextResponse> {
    try {
        console.log('🔐 Verificando token en /api/auth/me');

        const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
        console.log('🍪 Token encontrado:', !!token);

        if (!token) {
            console.log('❌ No hay token');
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        console.log('📖 Token decodificado:', decoded);

        return NextResponse.json({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        });

    } catch (error) {
        console.error('💥 Error en /api/auth/me:', error);
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
}