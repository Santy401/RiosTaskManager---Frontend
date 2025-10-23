import { useAreaBase } from "./useAreaBase";

export const useAreaActions = () => {
    const { setLoading, setError } = useAreaBase();

    const createArea = async (data: CreateAreaData): Promise<Area> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Creando área...', data);

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
                let errorMessage = 'Error al crear área';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const newArea = await response.json();
            console.log('✅ [HOOK] Área creada:', newArea);

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

    const updateArea = async (params: { areaId: string; data: UpdateAreaData }): Promise<Area> => {
        setLoading(true);
        setError(null);

        const { areaId, data } = params;

        try {
            console.log('🔄 [HOOK] Actualizando área...', { areaId, data });

            const response = await fetch(`/api/admin/areas/${areaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error al actualizar área';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const updatedArea = await response.json();
            console.log('✅ [HOOK] Área actualizada:', updatedArea);

            return updatedArea;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en updateArea:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitArea = async (data: CreateAreaData, editingArea?: Area | null): Promise<Area> => {
        if (editingArea) {
            return await updateArea({ areaId: editingArea.id, data });
        } else {
            return await createArea(data);
        }
    };

    const clearError = () => setError(null);

    return { createArea, deleteArea, updateArea, submitArea }
}