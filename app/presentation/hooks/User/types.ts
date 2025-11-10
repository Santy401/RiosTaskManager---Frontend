export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    user: User;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
    deletedUserId: string;
}

export interface UseUserResult {
    createUser: (data: CreateUserData) => Promise<CreateUserResponse>;
    getAllUsers: () => Promise<User[]>;
    invalidateUsersCache: () => void;
    deleteUser: (userId: string) => Promise<DeleteUserResponse>;
    isLoading: boolean;
    error: string | null;
}