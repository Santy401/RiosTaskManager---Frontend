import { useCallback, useEffect, useState } from "react"
import { useArea } from "@/app/presentation/hooks/Area/useArea"
import { useContextMenu } from "@/app/presentation/hooks/Menu/useContextMenu"
import { toast } from "react-toastify";

export interface Area {
    id: string;
    name: string;
    state: 'activo' | 'inactivo';
    createdAt: Date;
    updatedAt: Date;
}

interface CreateAreaFormData {
    name: string;
    state: 'activo' | 'inactivo';
}

interface CreateAreaData {
    name: string;
    state: boolean;
}

interface UpdateAreaData {
    name?: string;
    state?: boolean;
}
export const useAreaActions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [areas, setAreas] = useState<Area[]>([])
    const [editingArea, setEditingArea] = useState<Area | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)

    const { getAllAreas, createArea, deleteArea, updateArea, isLoading, isDeletingArea } = useArea();

    const { closeContextMenu } = useContextMenu()

    const loadAreas = useCallback(async () => {
        try {
            const areasData = await getAllAreas();
            setAreas(areasData)
        } catch (error) {
            console.error('❌ [COMPONENT] Error al cargar áreas:', error)
        }
    }, [getAllAreas])

    useEffect(() => {
        void loadAreas()
    }, [loadAreas])

    const convertToApiData = (formData: CreateAreaFormData): CreateAreaData => {
        return {
            name: formData.name,
            state: formData.state === 'activo'
        };
    };

    const convertToUpdateData = (formData: CreateAreaFormData): UpdateAreaData => {
        return {
            name: formData.name,
            state: formData.state === 'activo'
        };
    };

    const handleMenuAction = async (action: string, areaId: string, areaName: string): Promise<void> => {
        try {
            switch (action) {
                case 'view':
                    break
                case 'edit': {
                    const areaToEdit = areas.find(area => area.id === areaId)
                    if (areaToEdit) {
                        setEditingArea(areaToEdit)
                        setIsEditMode(true)
                        setIsModalOpen(true)
                    }
                    break
                }
                case 'delete':
                    if (confirm(`¿Eliminar el Área "${areaName}"?`)) {
                        await deleteArea(areaId)
                        await loadAreas()
                        toast.success('Área eliminada exitosamente')
                    }
                    break
                default:
                    break
            }
        } catch (error) {
            console.error('Error en acción:', error)
        } finally {
            closeContextMenu()
        }
    }

    const handleCreateArea = async (formData: CreateAreaFormData): Promise<void> => {
        try {
            if (isEditMode && editingArea) {
                const updateData = convertToUpdateData(formData);
                await updateArea({ areaId: editingArea.id, data: updateData })
                toast.success('Área editada exitosamente')
            } else {
                const createData = convertToApiData(formData);
                await createArea(createData)
            }
        } catch (error) {
            console.error('Error creando área:', error)
            throw error
        }
    }

    const handleCreateSuccess = (): void => {
        setIsModalOpen(false)
        void loadAreas()
        toast.success('Área creada exitosamente')
    }

    const handleAddAreaClick = (): void => {
        setEditingArea(null)
        setIsEditMode(false)
        setIsModalOpen(true)
    }

    return {
        areas,
        isLoading,
        closeContextMenu,
        isDeletingArea,
        handleMenuAction,
        handleCreateArea,
        handleCreateSuccess,
        handleAddAreaClick,
        isModalOpen,
        setIsModalOpen,
        editingArea,
        setEditingArea,
        isEditMode,
        setIsEditMode
    }
}