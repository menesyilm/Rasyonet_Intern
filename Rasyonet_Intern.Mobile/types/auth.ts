export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    surname: string;
    email: string;
    password: string;
};

export type UserResponse = {
    id: string;
    name: string;
    surname: string;
    email: string;
};

export type AuthResponse = {
    accessToken: string;
    expiresAt: string;
    user: UserResponse;
};