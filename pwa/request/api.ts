import {API_PATH} from "./utils";

export const URL_ENUM = {
    age_restriction: 'age_restrictions',
    installation_status: 'installation_statuses',
    review_status:  'review_statuses'
};

export const fetchEnums = async (url: string): Promise<Enum[]> => {
    const response = await fetch(`${API_PATH}${url}`, {
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