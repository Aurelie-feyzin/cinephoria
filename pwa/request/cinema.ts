import {API_PATH} from "./utils";
import {Cinema} from "../model/Cinema";

export const fetchCinemas = async (): Promise<Cinema[]> => {
    const response = await fetch(`${API_PATH}cinemas`, {
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
