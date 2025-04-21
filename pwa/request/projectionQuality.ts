import {API_PATH} from "./utils";

export const fetchProjectionQualities = async (): Promise<ProjectionQuality[]> => {
    const url = `${API_PATH}projection_qualities`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des qualités de projection');
    }

    const data = await response.json();

    return data['hydra:member'] || [];
}