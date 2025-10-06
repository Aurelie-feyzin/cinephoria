import Cookies from "js-cookie";
import {API_PATH, HOST_PATH} from "./utils";
import {ApiResponse} from "../model/ApiResponseType";
import {Movie, MovieDescription, MovieTmdb} from "../model/MovieInterface";

export const fetchMovieById = async (id: string): Promise<MovieDescription> => {
    const url = `${API_PATH}movies/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du film')
    }

    return await response.json();
}

export const fetchUpcomingMovies = async (): Promise<ApiResponse<MovieTmdb[]>> => {
    const url = `${API_PATH}movies/tmdb/upcoming`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des films bientôt disponible')
    }

    return await response.json();
}

export const searchTmdbMovies = async (title: string): Promise<any> => {
    const url = `${HOST_PATH}movies/tmdb/search`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify({title}),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
    }

    return await response.json();
}

export const fetchTmdbDetailMovie = async (tmdbId: number): Promise<any> => {
    const url = `${API_PATH}movies/tmdb/${tmdbId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du film')
    }

    return await response.json();
}

export const fetchMovieByUri = async (uri: string): Promise<MovieDescription> => {
    const response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du film')
    }

    return await response.json();
}

export const fetchMoviesBySearchInTitle = async (search: string): Promise<ApiResponse<MovieDescription>> => {
    const url = `${API_PATH}movies?title=${search}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du film')
    }

    return await response.json();
}

export const fetchNewMovies = async (): Promise<ApiResponse<Movie>> => {
    const url = `${API_PATH}new_list/movies`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des nouveautés de la semaine')
    }

    return await response.json();
}


export const fetchMovieInCinema = async (today: string, lastDay: string, cinema?: string): Promise<ApiResponse<MovieDescription>> => {
    const url = `${API_PATH}movies?movieShows.date%5Bbefore%5D=${lastDay}&movieShows.date%5Bafter%5D=${today}${cinema ? `&movieShows.movieTheater.cinema=${cinema}` : ''}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des films')
    }

    return await response.json();
}

export const fetchMoviesDescription = async (page: number, itemsPerPage: number): Promise<ApiResponse<MovieDescription>> => {
    const url = `${API_PATH}movies?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des films');
    }

    return await response.json();
}


export const updateMovieById = async (id: string, movieData: any) => {
    const response = await fetch(`${API_PATH}movies/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification du film')
    }
    return response.json()
}


export const createMovie = async (movieData: any) => {
    const response = await fetch(`${API_PATH}movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la création du film')
    }

    return await response.json()
}

export const deleteMovie = async (id: string) => {
    const response = await fetch(`${API_PATH}movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
    })
    if (!response.ok) {
        console.log(response);
        throw new Error('Erreur lors de la suppression du film')
    }
}