import Cookies from "js-cookie";

export const fetchMovieShowById = async (id: string): Promise<FullMovieShow> => {
    const url = `/movie_shows/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la séance')
    }

    return await response.json();
}

export const fetchMovieShowInCinema = async (cinemaId: string, today: string, lastDay: string): Promise<FullMovieShowApiResponse> => {
    const url = `${cinemaId}/movie_shows?page=1&movieShows.date%5Bbefore%5D=${lastDay}&movieShows.date%5Bafter%5D=${today}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances')
    }

    return await response.json();
}

export const fetchMovieShows = async (page: number, itemsPerPage: number): Promise<FullMovieShowApiResponse> => {
    const url = `/movie_shows?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances');
    }

    return await response.json();
}

export const updateMovieShowById = async (id: string, movieShowData: any) => {
    const response = await fetch(`/movie_shows/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieShowData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification de la séance')
    }
    return response.json()
}


export const createMovieShow = async (movieShowData: any) => {
    const response = await fetch(`/movie_shows`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(movieShowData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la création de la séance')
    }

    return await response.json()
}