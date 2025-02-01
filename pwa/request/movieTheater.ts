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

export const fetchMovieTheaters = async (page: number, itemsPerPage: number): Promise<MovieTheaterApiResponse> => {
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
}