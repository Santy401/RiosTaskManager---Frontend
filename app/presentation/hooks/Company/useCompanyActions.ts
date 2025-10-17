import { Company, CreateCompanyData } from "@/app/domain/entities/Company";
import { useCompanyBase } from "./useCompanyBase";

export const useCompanyActions = () => {
    const { setLoading, setError } = useCompanyBase();

    const createCompany = async (data: CreateCompanyData): Promise<Company> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Creando empresa...', data);

            const response = await fetch('/api/admin/companies', {
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
                let errorMessage = 'Error al crear empresa';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const newCompany = await response.json();
            console.log('✅ [HOOK] Empresa creada:', newCompany);

            return newCompany;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en createCompany:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const deleteCompany = async (companyId: string): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🗑️ [HOOK] Eliminando empresa:', companyId);

            const response = await fetch(`/api/admin/companies/${companyId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar empresa');
            }

            const result = await response.json();
            console.log('✅ [HOOK] Empresa eliminada exitosamente:', result);
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

    return { createCompany, deleteCompany };
}