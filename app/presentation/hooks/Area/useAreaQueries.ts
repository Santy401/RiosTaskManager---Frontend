import { useCallback } from "react";
import { useAreaBase } from "./useAreaBase";

export const useAreaQueries = () => {
    const { setError, setLoading } = useAreaBase();

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
            setLoading(false);
        }
    }, []);

    return { getAllAreas }

}