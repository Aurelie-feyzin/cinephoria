import Cookies from "js-cookie";
import {API_PATH} from "./utils";
import {Cinema} from "../model/Cinema";
import {fetchWithAuth} from "./auth";

export const fetchDashboard = async (refreshAccessToken: () => Promise<string | null>): Promise<Cinema[]> => {
    const response = await fetchWithAuth(
    `${API_PATH}dashboard/dashboard`,
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    }, refreshAccessToken);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données du dashboard');
    }

    return await response.json();
}