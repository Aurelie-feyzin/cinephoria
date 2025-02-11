import React from 'react';
import { View, Text,  TouchableOpacity, Image } from 'react-native';
import {Reservation} from "@/model/ReservationInterface";
import {router} from "expo-router";

const PlaceholderImage = require('@/assets/images/backdrops/placeholder.png');
const  SessionCard = ({ reservation }:{reservation: Reservation}) => {
    const { movieName, cinemaName, movieTheaterName, movieShowDate, movieShowEndTime, movieShowStartTime, seatNames, id } = reservation;

    return (
        <View className="bg-gray-950 p-4 rounded-lg shadow-md">
            <Image source={PlaceholderImage} className="w-full h-48 rounded-lg" />

            <Text className="text-xl font-semibold mt-4 text-secondary text-center">{movieName}</Text>

            <View className="mb-4">
                <Text className="text-white mb-3">
                    Le {new Date(movieShowDate).toLocaleDateString()} de {movieShowStartTime} à {movieShowEndTime}</Text>
                <Text className="text-white mb-3">Au cinéma {cinemaName}, salle {movieTheaterName}</Text>
                <Text className="text-white mb-3">Sièges: {seatNames.join(", ")}</Text>
            </View>

            <TouchableOpacity
                onPress={() => router.navigate(`/reservations/${id}`)}
                className="mt-4 bg-blue-500 p-3 rounded-lg flex items-center justify-center"
            >
                <Text className="text-white font-semibold bg-secondary">Voir le QRCode</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SessionCard;