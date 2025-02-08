

export const fetchSeatsByMovieTheater = async (movieTheaterId: string): Promise<ApiResponse<MinimalSeat>> => {
    const url = `/seats?movieTheater=${movieTheaterId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des sièges');
    }

    return await response.json();
}