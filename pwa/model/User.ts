
interface User {
    '@id': string;
    '@type': string,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type UserInput = {
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
}

type Employee = {
    '@id': string;
    '@type': string,
    id : string,
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

type EmployeeInput = {
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
    roles: string[];
}

type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    role?:string;
}

type LoginInput = {
    username: string;
    password: string;
}

type ResetPasswordInput = {
    password: string;
}

type ForgotPasswordInput = {
    email: string;
}