import {API_PATH} from "./utils";
import Cookies from "js-cookie";
import {Employee, EmployeeInput, Profile, User, UserInput} from "../model/User";
import {fetchWithAuth} from "./auth";

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

export const updateEmployeeById = async (id: string, EmployeeInput: EmployeeInput, refreshAccessToken: () => Promise<string | null>) => {
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

const postUser = async (data: EmployeeInput | UserInput,refreshAccessToken?: () => Promise<string | null>): Promise<User> => {
    const url: string = `${API_PATH}users`;
    const request: RequestInit = {
        method: 'POST',
        headers:         {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data),
    };

    let response= null;
    if (refreshAccessToken) {
        response = await fetchWithAuth(url, request, refreshAccessToken);
    } else {
        response = await fetch(url, request);
    }

    if (!response.ok) {
        throw new Error('Erreur lors de la création du compte');
    }

    return await response.json();
};

export const createUser = async (data: UserInput): Promise<User> => {
    return postUser(data);
};

export const createEmployee = async (data: EmployeeInput, refreshAccessToken: () => Promise<string | null>): Promise<User> => {
    return postUser(data, refreshAccessToken);
};