export declare class UserCreateDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    verified?: boolean;
}
