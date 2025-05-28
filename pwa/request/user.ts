import {API_PATH} from "./utils";
import Cookies from "js-cookie";
import {Employee, EmployeeInput, Profile, User, UserInput} from "../model/User";

export const getProfileInMiddelware = async(token: string): Promise<Profile> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${API_PATH}profile`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer le profil de l\'utilisateur');
    }

    return await response.json();
}

export const getProfile = async(): Promise<Profile> => {
    const url = `${API_PATH}profile`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer le profil de l\'utilisateur');
    }

    return await response.json();
}

export const fetchEmployee = async (id: string): Promise<Employee> => {
    const url = `${API_PATH}employees/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'employé');
    }

    return await response.json();
}
export const fetchEmployees = async (page: number, itemsPerPage: number): Promise<Employee> => {
    const url = `${API_PATH}employees?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des employées');
    }

    return await response.json();
}

export const updateEmployeeById = async (id: string, EmployeeInput: EmployeeInput) => {
    const response = await fetch(`${API_PATH}employees/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(EmployeeInput),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification du compte')
    }
    return response.json()
}

const postUser = async (data: EmployeeInput | UserInput, includeAuth = false): Promise<User> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/ld+json',
    };

    if (includeAuth) {
        const token = Cookies.get('jwt_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error('JWT token not found for authenticated request');
        }
    }

    const response = await fetch(`${API_PATH}users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la création du compte');
    }

    return await response.json();
};

export const createUser = async (data: UserInput): Promise<User> => {
    return postUser(data);
};

export const createEmployee = async (data: EmployeeInput): Promise<User> => {
    return postUser(data, true);
};