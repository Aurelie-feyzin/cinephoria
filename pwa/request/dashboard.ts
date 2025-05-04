import Cookies from "js-cookie";
import {API_PATH} from "./utils";
import {Cinema} from "../model/Cinema";

export const fetchDashboard = async (): Promise<Cinema[]> => {
    const response = await fetch(`${API_PATH}dashboard/dashboard`, {
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