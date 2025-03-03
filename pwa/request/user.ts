import {API_PATH} from "./utils";
import Cookies from "js-cookie";
import {fetchWithAuth} from "./auth";


export const fetchEmployee = async (id: string, refreshAccessToken: () => Promise<string | null>): Promise<Employee> => {
    const url = `${API_PATH}employees/${id}`;
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    }, refreshAccessToken);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'employé');
    }

    return await response.json();
}
export const fetchEmployees = async (page: number, itemsPerPage: number, refreshAccessToken: () => Promise<string | null>): Promise<Employee> => {
    const url = `${API_PATH}employees?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    }, refreshAccessToken);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des employées');
    }

    return await response.json();
}

export const updateEmployeeById = async (id: string, EmployeeInput: any, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(`${API_PATH}employees/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(EmployeeInput),
    }, refreshAccessToken)
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