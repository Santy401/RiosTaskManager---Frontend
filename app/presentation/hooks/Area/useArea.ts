import { useAreaActions } from "./useAreaActions";
import { useAreaBase } from "./useAreaBase";
import { useAreaQueries } from "./useAreaQueries";

interface UseAreaResult {
    getAllAreas: () => Promise<Area[]>;
    createArea: (data: CreateAreaData) => Promise<Area>;
    updateArea: (params: { areaId: string; data: UpdateAreaData }) => Promise<Area>;
    deleteArea: (areaId: string) => Promise<DeleteAreaResponse>;
    isDeletingArea: (areaId: string) => boolean;
    isLoading: boolean;
    error: string | null;
}

export const useArea = (): UseAreaResult => {
    const { getAllAreas } = useAreaQueries();
    const { createArea, deleteArea, updateArea, isDeletingArea } = useAreaActions();
    const { isLoading, error } = useAreaBase();

    return { getAllAreas, createArea, deleteArea, isLoading, error, updateArea, isDeletingArea };
};