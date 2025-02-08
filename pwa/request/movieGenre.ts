
export const fetchMovieGenres = async (): Promise<MovieGenre[]> => {
    const response = await fetch('/movie_genres', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la liste des genres');
    }

    const data = await response.json();

    return data['hydra:member'] || [];
}