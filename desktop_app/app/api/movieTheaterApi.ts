interface FullProjectionQuality {
    '@id': string;
    '@type': string,
    name: string;
    suggestedPrice: number;
}


export interface MovieTheater  {
    '@id': string;
    '@type': string,
    cinema: MinimalCinema;
    theaterName: string;
    numberOfSeats: number;
    reducedMobilitySeats: number;
    priceInEuros: number;
    projectionQuality: FullProjectionQuality;
}

export const fetchMovieTheatersByCinema = async (cinema: string): Promise<MovieTheater[]> => {
    const url = `${process.env.NEXT_PUBLIC_HOST_PATH}/movie_theaters?cinema=${cinema}`;
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