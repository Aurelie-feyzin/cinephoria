import Cookies from "js-cookie";
import {InstallationInput} from "@/app/ui/InstallationForm";
import {Enum} from "@/app/api/apiResponseType";
export interface InstallationMinimalDescription {
    '@id': string;
    '@type': string,
    id:string,
    name: string;
    movieTheater: MovieTheater;
    status: Enum;
}

export interface Installation {
    '@id': string;
    '@type': string,
    name: string;
    movieTheater: MovieTheater;
    status: Enum;
    repairDetails: string;
    lastMaintenanceDate: string;
    lastRepairDate: string;
}

export const fetchInstallationStatus = async (): Promise<Enum[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_PATH}/installation_statuses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des status');
    }

    const data = await response.json();

    return data['hydra:member'] || [];
}

export const fetchInstallation = async (id: string) => {
    const url = `${process.env.NEXT_PUBLIC_HOST_PATH}/installations/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération d\'une installation')
    }
    return await response.json();
};

export const fetchGetInstallationUnderMaintenance = async (page: number, itemsPerPage: number) => {
    const url = `${process.env.NEXT_PUBLIC_HOST_PATH}/out_of_service/installations?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des installations hors service')
    }
    return await response.json();
};

export const fetchGetInstallationByMovieTheater = async (movieTheater: string) => {
    const url = `${process.env.NEXT_PUBLIC_HOST_PATH}/installations?movieTheater=${movieTheater}&itemsPerPage=999`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des installations hors service')
    }
    const data = await response.json();

    return data['hydra:member'] || [];
};

export const updateInstallation = async (id: string, data: InstallationInput) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_PATH}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification d\'une installation')
    }
    return response.json()
}