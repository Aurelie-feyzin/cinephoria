import Cookies from "js-cookie";

export const fetchDashboard = async (): Promise<Cinema[]> => {
    const response = await fetch(`/dashboard/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données du dashboard');
    }

    return await response.json();
}