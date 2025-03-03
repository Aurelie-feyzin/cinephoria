import {fetchWithAuth} from "./auth";
import Cookies from "js-cookie";
import {API_PATH} from "./utils";
import {ApiResponse} from "../model/ApiResponseType";
import {Reservation} from "../model/ReservationInterface";

export const fetchUserReservations = async (past: boolean, page: number, itemsPerPage: number, refreshAccessToken: () => Promise<string | null>): Promise<ApiResponse<Reservation>> => {
    const response = await fetchWithAuth(
        `${API_PATH}user/reservations?page=${page}&itemsPerPage=${itemsPerPage}&past=${past}`,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/ld+json'}
        },
        refreshAccessToken
    )

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la liste des réservations');
    }

    return await response.json();
}

export const createReservation = async (reservationData: any, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(
        `${API_PATH}/reservation_dtos`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(reservationData),
        }, refreshAccessToken)
    if (!response.ok) {
        const payload = await response.json();
        const message = payload?.detail ?? 'Erreur lors de la création de la réservation';
        throw new Error(message)
    }

    return await response.json();
}