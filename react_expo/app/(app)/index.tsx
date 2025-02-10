import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import {useSession} from "@/context/authContext";
import {fetchSessions} from "@/api/reservationApi";
import SessionCard from "@/components/SessionCard";
import {useStorageState} from "@/state/useStorageState";

const MoviesScreen = () => {
    const { user } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const token: string|null = useStorageState('jwt_token')[0][1];

    useEffect(() => {
        const getSessions = async () => {
            try {
                const data = await fetchSessions(token);
                setReservations(data);  // On suppose que la réponse contient les séances
            } catch (error) {
                console.error("Erreur lors de la récupération des séances", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            setLoading(true);
            getSessions();
        }
    }, [user, token]);

    if (loading) {
        return <Text>Chargement des séances...</Text>;
    }

    return (
        <View className="flex-1 bg-primary p-4">
            <Text className="text-2xl font-bold mb-6 text-center text-white">Vos réservations</Text>

            {reservations?.length === 0 ? (
                <Text className="text-center text-lg text-white">Aucune séance à venir.</Text>
            ) : (
                <FlatList
                    data={reservations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <SessionCard reservation={item} />}
                />
            )}
        </View>
    );
};

export default MoviesScreen;