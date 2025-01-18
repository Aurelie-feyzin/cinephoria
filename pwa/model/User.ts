
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