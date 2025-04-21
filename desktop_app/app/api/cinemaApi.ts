export interface MinimalCinema {
    '@id': string;
    '@type': string,
    name: string;
}

export const fetchCinemas = async (): Promise<MinimalCinema[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}cinemas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cinémas');
    }

    const data = await response.json();

    return data['hydra:member'] || [];
}
