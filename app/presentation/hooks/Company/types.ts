import { Company, CreateCompanyData } from "@/app/domain/entities/Company";

export interface CompanyState {
    isLoading: boolean;
    error: string | null;
}

export interface CompanyActions {
    getAllCompany: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<any>;
    updateCompany: (params: { companyId: string; data: Partial<CreateCompanyData> }) => Promise<Company>;
    isDeletingCompany: (companyId: string) => boolean;
}

export type UseCompanyResult = CompanyState & CompanyActions;