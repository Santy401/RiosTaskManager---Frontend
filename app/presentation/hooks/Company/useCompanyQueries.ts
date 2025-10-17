import { Company } from "@/app/domain/entities/Company";
import { useCallback } from "react";
import { useCompanyBase } from "./useCompanyBase";

export const useCompanyQueries = () => {
    const { setLoading, setError } = useCompanyBase();

    const getAllCompany = useCallback(async (): Promise<Company[]> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Obteniendo empresas...');

            const response = await fetch('/api/admin/companies', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error al obtener empresas';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const companies = await response.json();
            console.log('✅ [HOOK] Empresas obtenidas:', companies);

            return companies;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en getAllCompay:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError])

    return { getAllCompany };
}
