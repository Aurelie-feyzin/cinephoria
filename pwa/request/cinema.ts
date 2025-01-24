import {HOST_PATH} from "./utils";

export const fetchCinemas = async (): Promise<Cinema[]> => {
    const response = await fetch(`${HOST_PATH}cinemas`, {
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
