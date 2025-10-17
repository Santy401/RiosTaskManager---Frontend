interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface CreateUserData {
    name: string;
    email: string;
    role: string;
    password: string;
}