import { useAreaActions } from "./useAreaActions";
import { useAreaBase } from "./useAreaBase";
import { useAreaQueries } from "./useAreaQueries";

export const useArea = (): UseAreaResult => {
    const { getAllAreas } = useAreaQueries();
    const { createArea, deleteArea, updateArea } = useAreaActions();
    const { isLoading, error } = useAreaBase();

    return { getAllAreas, createArea, deleteArea, isLoading, error, updateArea };
};