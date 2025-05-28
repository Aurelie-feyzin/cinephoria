export type Role = "employee" | "admin" | undefined;
export interface User {
    '@id': string;
    '@type': string,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type UserInput = {
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
}

export type Employee = {
    '@id': string;
    '@type': string,
    id : string,
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
}

export type EmployeeInput = {
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
    roles: Role[];
}

export type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    role?: Role;
}

export type LoginInput = {
    username: string;
    password: string;
}

export type ResetPasswordInput = {
    password: string;
}

export type ForgotPasswordInput = {
    email: string;
}