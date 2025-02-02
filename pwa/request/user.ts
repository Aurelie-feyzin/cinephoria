import {API_PATH} from "./utils";
import Cookies from "js-cookie";


export const fetchEmployee = async (id: string): Promise<Employee> => {
    const url = `/api/employees/${id}`;
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
    const url = `/api/employees?page=${page}&itemsPerPage=${itemsPerPage}`;
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

export const updateEmployeeById = async (id: string, EmployeeInput: any) => {
    const response = await fetch(`/api/employees/${id}`, {
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

export const createUser= (data: EmployeeInput|UserInput): Promise<Response> => fetch(`${API_PATH }users`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/ld+json',
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
    },
    body: JSON.stringify(data)
});