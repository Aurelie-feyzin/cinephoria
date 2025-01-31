

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