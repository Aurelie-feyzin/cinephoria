import {API_PATH} from "./utils";
import {AgeRestriction} from "../model/AgeRestriction";

export const fetchAgeRestrictions = async (): Promise<AgeRestriction[]> => {
    const response = await fetch(`${API_PATH}ageRestrictions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération sur l\'age');
    }

    const data = await response.json();

    return data['hydra:member'] || [];
}