interface Area {
    id: string;
    name: string;
    state: 'activo' | 'inactivo';
    createdAt: Date;
    updatedAt: Date;
}

interface CreateAreaData {
    name: string;
    state: boolean;
}

interface UpdateAreaData {
    name?: string;
    state?: boolean;
}

interface DeleteAreaResponse {
    success: boolean;
    message: string;
    deletedAreaId: string;
}

interface _UseAreaResult {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    updateArea: (params: { areaId: string; data: UpdateAreaData }) => Promise<Area>;
    deleteArea: (areaId: string) => Promise<DeleteAreaResponse>;
    isDeletingArea: (areaId: string) => boolean;
    isLoading: boolean;
    error: string | null;
}