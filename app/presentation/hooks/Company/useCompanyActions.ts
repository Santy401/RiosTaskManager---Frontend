import { Company, CreateCompanyData } from "@/app/domain/entities/Company";
import { useLoading } from '@/app/presentation/hooks/useLoading'
import { useCompanyBase } from "./useCompanyBase";
import { DeleteCompanyResponse } from "./types";
import { toast } from "react-toastify"

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

    const checkNitExists = async (nit: string): Promise<{exists: boolean, message?: string}> => {
        try {
            const response = await fetch(`/api/admin/companies/check-nit?nit=${encodeURIComponent(nit)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                return {
                    exists: false,
                    message: error.error || 'Error al verificar el NIT'
                };
            }

            const result = await response.json();
            return {
                exists: result.exists || false,
                message: result.exists ? 'El NIT ya está registrado' : undefined
            };
        } catch (error) {
            console.error('Error al verificar NIT:', error);
            return {
                exists: false,
                message: 'Error al conectar con el servidor'
            };
        }
    };

    const createCompany = async (data: CreateCompanyData): Promise<Company> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [HOOK] Validando NIT de empresa...', data.nit);
            
            // Verificar si el NIT ya existe
            const { exists: nitExists, message } = await checkNitExists(data.nit);
            if (nitExists) {
                const errorMessage = message || 'El NIT ya está registrado para otra empresa';
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }

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
                    
                    // Si el error es por NIT duplicado (aunque ya lo validamos, por si acaso)
                    if (errorData.code === 'P2002' && errorData.meta?.target?.includes('nit')) {
                        errorMessage = 'El NIT ya está registrado para otra empresa';
                    }
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            const newCompany = await response.json();
            console.log('✅ [HOOK] Empresa creada:', newCompany);
            toast.success('Empresa creada exitosamente');
            return newCompany;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en createCompany:', err);
            setError(errorMessage);
            
            // Solo mostrar toast si no es el error de NIT duplicado (ya se mostró antes)
            if (!errorMessage.includes('NIT ya está registrado')) {
                toast.error('Error al crear la empresa');
            }
            
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
            toast.error('Error al eliminar empresa')
            throw err;
        } finally {
            removeDeleting(companyId);
            setLoading(false);
            // toast.success('Empresa eliminada exitosamente')
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
            toast.error('Error al actualizar empresa')
            throw err;
        } finally {
            setLoading(false);
            toast.success('Empresa actualizada exitosamente')
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