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
    invalidateUsersCache: () => void;
}


let usersCache: User[] | null = null;
let pendingRequest: Promise<User[]> | null = null;

export const useUserQueries = (): UseUserQueriesResult => {
    const { setLoading, setError } = useUserBase();

    const invalidateUsersCache = () => {
        console.log('🗑️ [HOOK] Invalidando cache de usuarios');
        usersCache = null;
        pendingRequest = null;
    };

    const getAllUsers = async (forceRefresh = false): Promise<User[]> => {
        if (forceRefresh) {
            invalidateUsersCache();
        }

        if (pendingRequest && !forceRefresh) {
            return pendingRequest;
        }


        if (usersCache && !forceRefresh) {
            return usersCache;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔍 [HOOK] Iniciando fetch a /api/admin/users');

            pendingRequest = fetch('/api/admin/users', {
                method: 'GET',
                credentials: 'include',
            })
                .then(async (response) => {
                    console.log('📊 [HOOK] Response status:', response.status);

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
                    console.log('✅ [HOOK] Usuarios obtenidos exitosamente');


                    usersCache = users;
                    return users;
                })
                .finally(() => {
                    pendingRequest = null;
                    setLoading(false);
                });

            return await pendingRequest;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en getAllUsers:', err);
            setError(errorMessage);
            pendingRequest = null;
            throw err;
        }
    };

    return { getAllUsers, invalidateUsersCache };
}