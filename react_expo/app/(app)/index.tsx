import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import {useSession} from "@/context/authContext";
import {fetchSessions} from "@/api/reservationApi";
import SessionCard from "@/components/SessionCard";
import {sortBy} from 'lodash';
import {Reservation} from "@/model/ReservationInterface";


const MoviesScreen = () => {
    const { signOut } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSessions = async () => {
            try {
                const data = await fetchSessions(signOut);
                setReservations(sortBy(data, 'movieShowDate'));
            } catch (error) {
                console.error("Erreur lors de la récupération des séances", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        getSessions();
    }, [signOut]);

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
                    ItemSeparatorComponent={() =>
                        <View style={{ height: 10 }} />
                }
                />
            )}
        </View>
    );
};

export default MoviesScreen;