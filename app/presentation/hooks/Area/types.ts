export interface AreaState {
    isLoading: boolean;
    error: string | null;
}

export interface DeleteAreaResponse {
    success: boolean;
    message: string;
    deletedAreaId: string;
}

export interface AreaActions {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    updateArea?: ((params: { areaId: string; data: UpdateAreaData }) => Promise<Area>) | undefined
    deleteArea: (areaId: string) => Promise<DeleteAreaResponse>; 
}

export type UseAreaResult = AreaState & AreaActions