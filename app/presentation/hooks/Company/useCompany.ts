import { useCompanyBase } from "./useCompanyBase";
import { useCompanyActions } from "./useCompanyActions";
import { useCompanyQueries } from "./useCompanyQueries";
import { UseCompanyResult } from "./types";

export const useCompany = (): UseCompanyResult => {
    const { isLoading, error } = useCompanyBase();
    const { getAllCompany } = useCompanyQueries();
    const { createCompany, deleteCompany } = useCompanyActions();

    return {
        getAllCompany,
        createCompany,
        deleteCompany,
        isLoading,
        error
    };
};