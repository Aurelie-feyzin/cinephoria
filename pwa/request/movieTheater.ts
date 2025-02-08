import Cookies from "js-cookie";

export const fetchMovieTheaterById = async (id: string): Promise<MovieTheater> => {
    const url = `/movie_theaters/${id}`;
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
    const url = `/movie_theaters?cinema=${cinema}`;
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
    const url = `/movie_theaters?page=${page}&itemsPerPage=${itemsPerPage}`;
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

export const updateMovieTheater = async (id: string, movieTheaterData: any) => {
    const response = await fetch(`/movie_theaters/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieTheaterData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification de la salle')
    }
    return response.json()
}

export const createMovieTheater = async (movieTheaterData: any) => {
    const response = await fetch(`/movie_theaters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieTheaterData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la création de la salle')
    }

    return await response.json()
}