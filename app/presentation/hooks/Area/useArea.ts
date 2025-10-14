import { useCallback, useState } from "react";

interface Area {
    id: string;
    name: string;
    state: 'activo' | 'inactivo';
    createdAt: Date;
    UpdatedAt: Date;
}

interface CreateAreaData {
    name: string;
    state: 'activo' | 'inactivo';
}

interface UseAreaResult {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    deleteArea: (areaId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}

export const useArea = (): UseAreaResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllAreas = useCallback(async (): Promise<Area[]> => {
        try {
            console.log('🔄 [HOOK] Obteniendo areas...');

            const response = await fetch('/api/admin/areas', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error al obtener areas';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const areas = await response.json();
            console.log('✅ [HOOK] areas obtenidas:', areas);

            return areas;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en getAllareas:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createArea = async (data: CreateAreaData): Promise<Area> => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    const deleteArea = async (areaId: string): Promise<any> => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    return { getAllAreas, createArea, deleteArea, isLoading, error };
};