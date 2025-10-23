export interface AreaState {
    isLoading: boolean;
    error: string | null;
}

export interface AreaActions {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    updateArea?: ((params: { areaId: string; data: UpdateAreaData }) => Promise<Area>) | undefined
    deleteArea: (areaId: string) => Promise<any>; // También cambia companyId por areaId
}
export type UseAreaResult = AreaState & AreaActions