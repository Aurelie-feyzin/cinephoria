import {API_PATH} from "@/api/utils";
import {Reservation, ReservationMinimal} from "@/model/ReservationInterface";
import {fetchWithAuth} from "@/api/auth";

export const fetchSessions = async (): Promise<Reservation[]> => {
    try {
        const now = new Date().toLocaleDateString('en-CA');
        const response = await fetchWithAuth(`user/reservations?movieShowDate%5Bafter%5D=${now}`,
        {method: 'GET',},
    );

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des réservations');
        }

        const data = await response.json();

        return data['hydra:member'] || [];
    } catch (error) {
        throw error;
    }
};

export const fetchOneSession = async (id: string): Promise<ReservationMinimal> => {
    try {
        const response = await fetchWithAuth(`reservations/${id}`,
            {method: 'GET',},
        );

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la réservation');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};