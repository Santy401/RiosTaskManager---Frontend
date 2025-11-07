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

export interface CompanyFromAPI {
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
    createdAt: string;
    updatedAt: string;
}

export interface CompanyForForm {
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
    createdAt: Date;
    updatedAt: Date;
}

export interface CompanyFormData {
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

interface DeleteCompanyResponse {
    success: boolean;
    message: string;
    deletedCompanyId: string;
}

export interface UseCompanyResult {
    getAllCompany: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<DeleteCompanyResponse>;
    updateCompany: (params: { companyId: string; data: Partial<CreateCompanyData> }) => Promise<Company>;
    isLoading: boolean;
    error: string | null;
}