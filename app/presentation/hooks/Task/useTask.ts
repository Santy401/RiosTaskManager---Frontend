import { useTaskBase } from "./useTaskBase";
import { useTaskActions } from "./useTaskActions";
import { useTaskQueries } from "./useTaskQueries";
import { UseTaskResult } from "./type";

export const useTask = (): UseTaskResult => {
  const { getAllTasks, getTaskById } = useTaskQueries();
  const { createTask, updateTask, deleteTask, isDeletingTask } = useTaskActions();
  const { isLoading, error } = useTaskBase();

  return {
    isDeletingTask,
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    error
  };
}