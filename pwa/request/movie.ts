import Cookies from "js-cookie";

export const fetchMovieById = async (id: string): Promise<MovieDescription> => {
    const url = `/movies/${id}`;
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

export const fetchMoviesBySearchInTitle = async (search: string): Promise<MovieDescriptionApiResponse> => {
    const url = `/movies?title=${search}`;
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

export const fetchNewMovies = async (): Promise<MovieApiResponse> => {
    const url = `/movie/new_list`;
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


export const fetchMovieInCinema = async (today: string, lastDay: string): Promise<MovieApiResponse> => {
    const url = `/movie/in_cinema?page=1&movieShows.date%5Bbefore%5D=${lastDay}&movieShows.date%5Bafter%5D=${today}`;
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

export const fetchMoviesDescription = async (page: number, itemsPerPage: number): Promise<MovieDescriptionApiResponse> => {
    const url = `/movies?page=${page}&itemsPerPage=${itemsPerPage}`;
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
    const response = await fetch(`/movies/${id}`, {
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
    const response = await fetch(`/movies`, {
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