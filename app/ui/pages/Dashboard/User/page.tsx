'use client';

import { useEffect, useState } from 'react';

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                console.log('User dashboard loading...');

                // Check if we have a token
                const token = document.cookie.split(';').find(c => c.trim().startsWith('token='));
                console.log('Token found:', !!token);

                if (token) {
                    const tokenValue = token.split('=')[1];
                    const payload = JSON.parse(atob(tokenValue.split('.')[1]));
                    setUser(payload);
                    console.log('User from token:', payload);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error initializing dashboard:', error);
                setLoading(false);
            }
        };

        initDashboard();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>
            {user ? (
                <>
                    <p>Bienvenido, {user.name || 'Usuario'}!</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Desde aquí puedes ver tus tareas y actualizar tu información.</p>
                </>
            ) : (
                <p>No se pudo obtener información del usuario. Verifica tu autenticación.</p>
            )}
        </div>
    )
}
