import { useUserBase } from "./useUserBase";

export const useUserActions = () => {
    const { setLoading, setError } = useUserBase();

    const createUser = async (data: CreateUserData): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Iniciando creación de usuario:', data);

            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: (data.role || 'user').toLowerCase()
            };

            console.log('📤 [HOOK] Payload enviado:', payload);

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear usuario');
            }

            return await response.json();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🗑️ [HOOK] Eliminando usuario:', userId);

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar usuario');
            }

            const result = await response.json();
            console.log('✅ [HOOK] Usuario eliminado exitosamente:', result);
            return result;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en deleteUser:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createUser, deleteUser }
}