export interface AreaState {
    isLoading: boolean;
    error: string | null;
}

export interface AreaActions {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    deleteArea: (companyId: string) => Promise<any>;
}

export type UseAreaResult = AreaState & AreaActions