import { useUserBase } from "./useUserBase";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    areaId: string;
    state: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface UseUserQueriesResult {
    getAllUsers: () => Promise<User[]>;
}

export const useUserQueries = (): UseUserQueriesResult => {
    const { setLoading, setError } = useUserBase();

    const getAllUsers = async (): Promise<User[]> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 [HOOK] Iniciando fetch a /api/admin/users');

            const response = await fetch('/api/admin/users', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('📊 [HOOK] Response status:', response.status);
            console.log('📋 [HOOK] Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ [HOOK] Error response text:', errorText);

                let errorMessage = 'Error al obtener usuarios';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const users = await response.json();
            console.log('✅ [HOOK] Usuarios obtenidos exitosamente:', users);

            return users;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en getAllUsers:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { getAllUsers }
}