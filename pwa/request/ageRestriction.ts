
export const fetchAgeRestrictions = async (): Promise<AgeRestriction[]> => {
    const response = await fetch('/age_restrictions', {
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