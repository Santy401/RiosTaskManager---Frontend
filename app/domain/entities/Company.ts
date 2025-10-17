export interface Company {
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

export interface CreateCompanyData {
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

export interface UseCompanyResult {
    getAllCompay: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}