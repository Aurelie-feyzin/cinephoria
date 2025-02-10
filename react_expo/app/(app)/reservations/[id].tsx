import {useLocalSearchParams} from 'expo-router';
import {Text ,View} from 'react-native';
import {fetchOneSession, } from "@/api/reservationApi";
import {useStorageState} from "@/state/useStorageState";
import QRCode from "react-native-qrcode-svg";
import {useEffect, useState} from "react";

export interface ReservationQrCodeInterface {
    cinemaName: string;
    date: string;
    hours: string;
    theaterName: string;
    numberOfSeats: number;
}

const ReservationQrCode = ()=> {
    const { id } = useLocalSearchParams();
    const [reservation, setReservation] = useState<ReservationQrCodeInterface>()
    const [movieName, setMovieName] = useState<string>()
    const token: string|null = useStorageState('jwt_token')[0][1];

    useEffect(() => {
        const getSession = async () => {
            try {
                const data = await fetchOneSession(token, id);
                const formatedData = {
                    cinemaName: data.cinemaName,
                    numberOfSeats: data.numberOfSeats,
                    date: new Date(data.movieShowDate).toLocaleDateString(),
                    hours: `De ${data.movieShowStartTime} à  ${data.movieShowEndTime}`,
                    theaterName: data.movieTheaterName
                }
                setReservation(formatedData);
                setMovieName(data.movieName);
            } catch (error) {
                console.error("Erreur lors de la récupération des séances", error);
            } finally {
               // setLoading(false);
            }
        };

        if (token) {
         //   setLoading(true);
            getSession();
        }
    }, [id, token]);

    return (
        <View className="items-center justify-center p-4">
            <Text className="text-lg font-semibold">QR Code pour {movieName}</Text>
            {reservation &&
            <QRCode
                value={JSON.stringify(reservation)}
                size={200}
                color="black"
                backgroundColor="white"
            />
            }
        </View>
    );
}

export default ReservationQrCode;