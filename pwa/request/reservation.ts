import Cookies from "js-cookie";
import {API_PATH} from "./utils";

export const fetchUserReservations = async (past: boolean, page: number, itemsPerPage: number): Promise<ApiResponse<Reservation>> => {
    const response = await fetch(`${API_PATH}user/reservations?page=${page}&itemsPerPage=${itemsPerPage}&past=${past}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la liste des réservations');
    }

    return await response.json();
}

export const createReservation = async (reservationData: any) => {
    const response = await fetch(`${API_PATH}reservation_dtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(reservationData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la création de la réservation')
    }

    return await response.json()
}