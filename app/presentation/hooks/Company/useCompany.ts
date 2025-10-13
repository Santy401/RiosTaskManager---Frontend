import { useState } from "react";

interface Company {
    id: string;
    name: string;
    nit: string;
    email: string;
    dian: string;
    firma: string;
    usuario: string;
    contraseña: string;
    servidorCorreo: string;
    tipo: string;
}

interface CreateCompanyData {
    name: string;
    nit: string;
    email: string;
    dian: string;
    firma: string;
    usuario: string;
    contraseña: string;
    servidorCorreo: string;
    tipo: string;
}

interface UseCompanyResult {
    getAllCompay: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    isLoading: boolean;
    error: string | null;
}

export const useCompany = (): UseCompanyResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllCompay = async (): Promise<Company[]> => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    }

    const createCompany = async (data: CreateCompanyData): Promise<Company> => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    }

    return { 
        getAllCompay, 
        createCompany,
        isLoading, 
        error 
    };
}