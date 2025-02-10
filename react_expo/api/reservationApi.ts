import { HOST_PATH} from "@/api/utils";
import {Reservation} from "@/model/ReservationInterface";

export const fetchSessions = async (token: string|null): Promise<Reservation[]> => {
    try {
        const response = await fetch(`${HOST_PATH}user/reservations`, {
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
        console.log(data['hydra:member'] || []);

        return data['hydra:member'] || [];
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};