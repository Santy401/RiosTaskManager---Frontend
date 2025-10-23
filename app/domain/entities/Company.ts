export interface Company {
    id: string;
    name: string;
    tipo: string;
    nit: string;
    cedula: string;
    dian: string;
    firma: string;
    softwareContable: string;
    usuario: string;
    servidorCorreo: string;
    email: string;
    claveCorreo: string;
    claveCC: string;
    claveSS: string;
    claveICA: string;
    contraseña: string;
    createdAt: string;  // Campo añadido
    updatedAt: string;  // Campo añadido
}

export interface CreateCompanyData {
    name: string;
    tipo: string;
    nit: string;
    cedula: string;
    dian: string;
    firma: string;
    softwareContable: string;
    usuario: string;
    servidorCorreo: string;
    email: string;
    claveCorreo: string;
    claveCC: string;
    claveSS: string;
    claveICA: string;
    contraseña: string;
    // Nota: createdAt y updatedAt no se incluyen en CreateCompanyData
    // porque son generados automáticamente por la base de datos
}

export interface UseCompanyResult {
    getAllCompany: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<any>;
    updateCompany: (params: { companyId: string; data: Partial<CreateCompanyData> }) => Promise<Company>;
    isLoading: boolean;
    error: string | null;
}