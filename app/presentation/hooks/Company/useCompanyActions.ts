import { Company, CreateCompanyData } from "@/app/domain/entities/Company";
import { useLoading } from '@/app/presentation/hooks/useLoading'
import { useCompanyBase } from "./useCompanyBase";
import { DeleteCompanyResponse } from "./types";

interface UseCompanyActionsResult {
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<DeleteCompanyResponse>;
    updateCompany: (params: { companyId: string; data: Partial<CreateCompanyData> }) => Promise<Company>;
    submitCompany: (data: CreateCompanyData, editingCompany?: Company | null) => Promise<Company>;
    isDeletingCompany: (companyId: string) => boolean;
}

export const useCompanyActions = (): UseCompanyActionsResult => {
    const { setLoading, setError } = useCompanyBase();
    const { addDeleting, removeDeleting, isDeleting } = useLoading();

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

    const deleteCompany = async (companyId: string): Promise<DeleteCompanyResponse> => {
        addDeleting(companyId);
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
            removeDeleting(companyId);
            setLoading(false);
        }
    };

    const updateCompany = async (params: { companyId: string; data: Partial<CreateCompanyData> }): Promise<Company> => {
        setLoading(true);
        setError(null);

        const { companyId, data } = params;

        try {
            console.log('🔄 [HOOK] Actualizando empresa...', { companyId, data });

            const response = await fetch(`/api/admin/companies/${companyId}`, {
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
                let errorMessage = 'Error al actualizar empresa';

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const updatedCompany = await response.json();
            console.log('✅ [HOOK] Empresa actualizada:', updatedCompany);

            return updatedCompany;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en updateCompany:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitCompany = async (data: CreateCompanyData, editingCompany?: Company | null): Promise<Company> => {
        if (editingCompany) {
            return await updateCompany({ companyId: editingCompany.id, data });
        } else {
            return await createCompany(data);
        }
    };

    return { 
        createCompany, 
        deleteCompany, 
        updateCompany, 
        submitCompany, 
        isDeletingCompany: isDeleting 
    };
};