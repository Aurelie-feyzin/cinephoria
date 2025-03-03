import Cookies from "js-cookie";
import {API_PATH} from "./utils";
import {ApiResponse} from "../model/ApiResponseType";
import {MovieTheater} from "../model/movieTheater";
import {fetchWithAuth} from "./auth";

export const fetchMovieTheaterById = async (id: string): Promise<MovieTheater> => {
    const url = `${API_PATH}movie_theaters/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la salle')
    }

    return await response.json();
}

export const fetchMovieTheatersByCinema = async (cinema: string): Promise<MovieTheater> => {
    const url = `${API_PATH}movie_theaters?cinema=${cinema}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des salles')
    }
    const data = await response.json();

    return data['hydra:member'] || [];
}

export const fetchMovieTheaters = async (page: number, itemsPerPage: number): Promise<ApiResponse<MovieTheater>> => {
    const url = `${API_PATH}movie_theaters?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des salles');
    }

    return await response.json();
}

export const updateMovieTheater = async (id: string, movieTheaterData: any, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(`${API_PATH}movie_theaters/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(movieTheaterData),
    },
        refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la modification de la salle')
    }
    return response.json()
}

export const createMovieTheater = async (movieTheaterData: any, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(
        `${API_PATH}movie_theaters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(movieTheaterData),
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la création de la salle')
    }

    return await response.json()
}