import {InstallationInput} from "@/app/ui/InstallationForm";
import {Enum} from "@/app/api/apiResponseType";
import { MovieTheater } from '@/app/api/movieTheaterApi';
import {fetchWithAuth} from "@/app/api/auth";
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}installation_statuses`, {
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

export const fetchInstallation = async (id: string, refreshAccessToken:  () => Promise<string | null>) => {
    const url = `${process.env.NEXT_PUBLIC_API_PATH}installations/${id}`;
    const token = await getToken();
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        },
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération d\'une installation')
    }
    return await response.json();
};

export const fetchGetInstallationUnderMaintenance = async (page: number, itemsPerPage: number, refreshAccessToken:  () => Promise<string | null>) => {
    const url = `${process.env.NEXT_PUBLIC_API_PATH}out_of_service/installations?page=${page}&itemsPerPage=${itemsPerPage}`;
    const token = await getToken();
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        },
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des installations hors service')
    }
    return await response.json();
};

export const fetchGetInstallationByMovieTheater = async (movieTheater: string, refreshAccessToken:  () => Promise<string | null>) => {
    const url = `${process.env.NEXT_PUBLIC_API_PATH}installations?movieTheater=${movieTheater}&itemsPerPage=999`;
    const token = await getToken();
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        },
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des installations hors service')
    }
    const data = await response.json();

    return data['hydra:member'] || [];
};

export const updateInstallation = async (id: string, data: InstallationInput, refreshAccessToken:  () => Promise<string | null>) => {
    const token = await getToken();
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_HOST_PATH}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(data),
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la modification d\'une installation')
    }
    return response.json()
}