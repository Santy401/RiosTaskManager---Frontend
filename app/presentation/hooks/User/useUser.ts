import { useUserActions } from './useUserActions';
import { useUserQueries } from './useUserQueries';
import { useUserBase } from './useUserBase';
import { UseUserResult } from './types';

export const useUser = (): UseUserResult => {
  const { getAllUsers, invalidateUsersCache } = useUserQueries();
  const { createUser, deleteUser } = useUserActions();
  const { isLoading, error } = useUserBase();

  return { createUser, getAllUsers, invalidateUsersCache, isLoading, deleteUser, error };
};