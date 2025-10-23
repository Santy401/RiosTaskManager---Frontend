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

interface UseAreaResult {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    updateArea: (params: { areaId: string; data: UpdateAreaData }) => Promise<Area>; // ← Quita el ?
    deleteArea: (areaId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}