import { User } from "@prisma/client";

export interface UserRepository {
    login(email: string, password: string): Promise<User | null>;
    register(user: User): Promise<User>;
}
