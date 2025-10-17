import { useTaskBase } from "./useTaskBase";
import { useTaskActions } from "./useTaskActions";
import { useTaskQuieries } from "./useTaskQueries";
import { UseTaskResult } from "./type";

export const useTask = (): UseTaskResult => {
  const { getAllTasks, getTaskById } = useTaskQuieries();
  const { createTask, updateTask, deleteTask } = useTaskActions();
  const { isLoading, error } = useTaskBase();

  return {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    error
  };
}