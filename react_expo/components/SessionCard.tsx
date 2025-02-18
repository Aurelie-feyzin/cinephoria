import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Reservation} from "@/model/ReservationInterface";
import {router} from "expo-router";
import ViewImage from "@/components/ViewImage";

const  SessionCard = ({ reservation }:{reservation: Reservation}) => {
    const { movieName, movieBackdropPath, cinemaName,movieTheaterName, movieShowDate, movieShowEndTime, movieShowStartTime, seatNames, id } = reservation;

    return (
        <View style={{backgroundColor: '#1d1e1c', padding: 12, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
            <ViewImage backdrop={movieBackdropPath}/>
            <Text className="text-xl font-semibold mt-4 text-secondary text-center">{movieName}</Text>

            <View className="p-4">
                <Text className="text-white" style={{paddingBottom: 4}}>
                    Le {new Date(movieShowDate).toLocaleDateString()} de {movieShowStartTime} à {movieShowEndTime}</Text>
                <Text className="text-white" style={{paddingBottom: 4}}>Au cinéma {cinemaName}, salle {movieTheaterName}</Text>
                <Text className="text-white" >Sièges: {seatNames.join(", ")}</Text>
            </View>

            <TouchableOpacity
                onPress={() => router.navigate(`/reservations/${id}`)}
                className="bg-blue-500 p-3 rounded-lg flex items-center justify-center"
            >
                <Text className="text-white font-semibold bg-secondary">Voir le QRCode</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SessionCard;