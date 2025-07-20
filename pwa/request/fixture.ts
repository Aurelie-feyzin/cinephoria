import {API_PATH} from "./utils";
import Cookies from "js-cookie";

export const addFixtures = async (): Promise<any> => {
    const response = await fetch(`${API_PATH}complete-fixtures`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });

    if (!response.ok) {
        console.log(response);
        throw new Error('Erreur lors de la récupération des données du dashboard');
    }

    return await response.json();
}