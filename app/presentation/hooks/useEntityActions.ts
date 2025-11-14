import { toast } from 'react-toastify';

interface DeleteEntityOptions {
  entityName: string;
  entityId: string;
  endpoint: string;
  onSuccess?: () => Promise<void> | void;
  customMessages?: {
    success?: string;
    error?: string;
    constraintError?: string;
  };
}

export const useEntityActions = () => {
  const deleteEntity = async ({
    entityName,
    entityId,
    endpoint,
    onSuccess,
    customMessages = {}
  }: DeleteEntityOptions): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/admin/${endpoint}/${entityId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = customMessages.error || `Error al eliminar ${entityName}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          
          // Check if this is a constraint error (related items exist)
          if (response.status === 400 && errorData.code === 'P2003') {
            const message = customMessages.constraintError || 
              `No se puede eliminar ${entityName} porque tiene elementos relacionados`;
            toast.error(message);
            return { success: false, error: message };
          }
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }
        
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const successMessage = customMessages.success || `${entityName} eliminado(a) exitosamente`;
      toast.success(successMessage);
      
      if (onSuccess) {
        await onSuccess();
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error al eliminar ${entityName}:`, error);
      toast.error(`Error al eliminar ${entityName}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  return { deleteEntity };
};
