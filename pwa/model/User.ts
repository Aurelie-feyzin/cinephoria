
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
    roles: string[];
}

export type EmployeeInput = {
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
    roles: string[];
}

export type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    role?:string;
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