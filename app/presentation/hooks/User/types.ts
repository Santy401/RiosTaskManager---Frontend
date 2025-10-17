export interface UseUserResult {
    createUser: (data: CreateUserData) => Promise<any>;
    getAllUsers: () => Promise<User[]>;
    deleteUser: (userId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}

