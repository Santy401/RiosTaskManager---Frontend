import { Company, CreateCompanyData } from "@/app/domain/entities/Company";

export interface CompanyState {
    isLoading: boolean;
    error: string | null;
}

export interface CompanyActions {
    getAllCompany: () => Promise<Company[]>;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    deleteCompany: (companyId: string) => Promise<any>;
}

export type UseCompanyResult = CompanyState & CompanyActions;