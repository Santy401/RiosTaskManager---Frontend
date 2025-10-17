import { useAreaBase } from "./useAreaBase";

export const useAreaActions = () => {
    const { setLoading, setError } = useAreaBase();

    const createArea = async (data: CreateAreaData): Promise<Area> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Creando areas...', data);

            const response = await fetch('/api/admin/areas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error al crear area';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const newArea = await response.json();
            console.log('✅ [HOOK] area creada:', newArea);

            return newArea;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en createArea:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteArea = async (areaId: string): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🗑️ [HOOK] Eliminando area:', areaId);

            const response = await fetch(`/api/admin/areas/${areaId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar area');
            }

            const result = await response.json();
            console.log('✅ [HOOK] area eliminada exitosamente:', result);
            return result;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en deleteCompany:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createArea, deleteArea }

}