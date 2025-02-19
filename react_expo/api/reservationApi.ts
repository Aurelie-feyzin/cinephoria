import { HOST_PATH} from "@/api/utils";
import {Reservation, ReservationMinimal} from "@/model/ReservationInterface";

export const fetchSessions = async (token: string|null): Promise<Reservation[]> => {
    try {
        const now = new Date().toLocaleDateString('en-CA');
        const response = await fetch(`${HOST_PATH}user/reservations?movieShowDate%5Bafter%5D=${now}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des réservations');
        }

        const data = await response.json();

        return data['hydra:member'] || [];
    } catch (error) {
        throw error;
    }
};

export const fetchOneSession = async (token: string|null, id: string): Promise<ReservationMinimal> => {
    try {
        const response = await fetch(`${HOST_PATH}reservations/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des réservations');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw error;
    }
};