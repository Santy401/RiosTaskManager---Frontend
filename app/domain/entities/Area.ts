interface Area {
    id: string;
    name: string;
    state: 'activo' | 'inactivo';
    createdAt: Date;
    UpdatedAt: Date;
}

interface CreateAreaData {
    name: string;
    state: 'activo' | 'inactivo';
}

interface UseAreaResult {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    deleteArea: (areaId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}