import { useUserBase } from "./useUserBase";
import { useUserQueries } from "./useUserQueries";
import { CreateUserData, CreateUserResponse, DeleteUserResponse } from "./types";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface UseUserActionsResult {
    createUser: (data: CreateUserData) => Promise<CreateUserResponse>;
    deleteUser: (userId: string) => Promise<DeleteUserResponse>;
    invalidateUsersCache: () => void;
}

export const useUserActions = (): UseUserActionsResult => {
    const { setLoading, setError } = useUserBase();
    const { invalidateUsersCache } = useUserQueries();

    const createUser = async (data: CreateUserData): Promise<CreateUserResponse> => {
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

            const result = await response.json();

            console.log('🔄 [HOOK] Usuario creado, invalidando cache...');
            invalidateUsersCache();

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            throw err;
            toast.error('Error al crear usuario')
        } finally {
            setLoading(false);
            toast.success('Usuario creado exitosamente')
        }
    };

    const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
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
                const errorText = await response.text();
                let errorMessage = 'Error al eliminar el usuario';
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                    
                    // Check if this is a constraint error (related items exist)
                    if (response.status === 400 && errorData.code === 'P2003') {
                        toast.error('No se puede eliminar el usuario porque tiene elementos relacionados');
                        return { 
                            success: false, 
                            message: 'No se puede eliminar el usuario porque tiene elementos relacionados',
                            deletedUserId: userId 
                        };
                    }
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('✅ [HOOK] Usuario eliminado exitosamente:', result);
            console.log('🔄 [HOOK] Usuario eliminado, invalidando cache...');
            
            invalidateUsersCache();
            toast.success('Usuario eliminado exitosamente');
            
            return { 
                success: true, 
                message: 'Usuario eliminado exitosamente', 
                deletedUserId: userId 
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en deleteUser:', err);
            setError(errorMessage);
            toast.error('Error al eliminar el usuario');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createUser, deleteUser, invalidateUsersCache }
}