'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/styles/Login.module.css'

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting login for:', formData.email);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            console.log('Login response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al iniciar sesión');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Check if cookie was set
            console.log('Document cookies after login:', document.cookie);

            // Small delay to ensure cookie is set before redirect
            await new Promise(resolve => setTimeout(resolve, 200));

            // Redirect after successful login
            const redirectPath = data.user.role === 'admin' ? '/ui/pages/Dashboard/Admin' : '/ui/pages/Dashboard/User';
            console.log('Redirecting to:', redirectPath);

            window.location.href = redirectPath;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className='text-black text-[19px]'>Inicia Sesión</h2>
                <div className={styles.inputs}>
                    <input
                        className={styles.input}
                        type="email"
                        autoComplete="off"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        autoComplete="off"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        className={styles.button}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}