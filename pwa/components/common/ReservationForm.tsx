'use client';

import InputField from "./form/InputField";
import {customMax, customMin, REQUIRED} from "./form/validator_tools";
import RadioButtons, {OptionBooleans} from "./form/RadioButtons";
import SelectField from "./form/SelectField";
import {formatToSelectOption} from "./form/utils";
import ButtonSubmit from "./button/ButtonSubmit";
import React, {useState} from "react";
import {useMutation, useQuery} from "react-query";
import {createReservation} from "../../request/reservation";
import {SubmitHandler, useForm} from "react-hook-form";
import {fetchSeatsByMovieTheater} from "../../request/seat";
import {router} from "next/client";
import AlertError from "./alert/AlertError";
import PageLoading from "./PageLoading";
import dayjs from "dayjs";
import {useUser} from "../../context/UserContext";
import {API_PATH} from "../../request/utils";
import {ApiResponse} from "../../model/ApiResponseType";
import {MovieShowReservation} from "../../model/MovieShow";
import {MinimalSeat} from "../../model/Seat";
import InputNumberField from "./form/InputNumberField";

type ReservationInput = {
    numberOfSeats: number,
    isSelectSeat: string,
    isReducedMobility: string,
    seats: string[],
}

const ReservationForm = ({filmShow}: { filmShow: MovieShowReservation }) => {
    const {user, refreshAccessToken} = useUser();
    const {register, handleSubmit, formState: {errors}, watch} = useForm<ReservationInput, Error>(
        {
            defaultValues: {
                isSelectSeat: String(false),
                isReducedMobility: String(false),
                seats: [],
            }
        }
    );
    const [seats, setSeats] = useState<MinimalSeat[]>([]);
    const isChooseSeats = watch('isSelectSeat');
    const isReducedMobility = watch('isReducedMobility');
    const numberOfSeats = watch('numberOfSeats');
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {error, isLoading} = useQuery<ApiResponse<MinimalSeat>, Error>(
        ["seats", filmShow?.movieTheater["@id"]],
        () => fetchSeatsByMovieTheater(filmShow?.movieTheater["@id"]), {
            enabled: !!filmShow?.movieTheater["@id"],
            onSuccess: (data) => {
                setSeats(data['hydra:member']);
            }
        });

    const mutation = useMutation({
        mutationFn: (reservationData: any) => createReservation(reservationData, refreshAccessToken),
        onSuccess: () => {
            router.push(`/orders`)
        },
        onError: (error: Error) => {
            setMessageKo(error.message);
        },
    })

    const handleReservation: SubmitHandler<any> = async (data) => {
        try {
            const reservationData = {
                ...data,
                movieShow: `${API_PATH}movie_shows/${filmShow?.id}`
            }
            delete reservationData.isReducedMobility;
            delete reservationData.isSelectSeat;
            mutation.mutate(reservationData)
        } catch (error) {
            setMessageKo("Erreur, la réservation n'a pas été faite");
        }
    }

    return (
        user &&
        <div className="max-w-full mx-auto bg-black rounded-lg shadow-md gap-4 pt-3">
            <h2 className="text-secondary text-center font-bold text-xl">Réservation</h2>
            <h3 className="text-custom_brown font-bold mb-2">
                {`Séance du ${dayjs(filmShow.date).format('DD/MM/YYYY')} de ${filmShow.startTime} à ${filmShow.endTime}
                                     (${filmShow.movieTheater.projectionQuality.name} - ${filmShow.priceInEuros}€)`}
            </h3>
            <AlertError visible={!!messageKo} message={messageKo} />
            <form className="max-w-full mx-auto" onSubmit={handleSubmit(handleReservation)}>
                <InputNumberField
                    register={register("numberOfSeats", {...REQUIRED, ...customMin(1), ...customMax(filmShow.availableSeats)})}
                    min={1}
                    max={filmShow.availableSeats}
                    name='numberOfSeats'
                    label='Nombre de places'
                    error={errors.numberOfSeats?.message}
                    className="w-full"
                />
                <p className="w-full text-white mb-4">Total = {filmShow.priceInEuros * numberOfSeats}€</p>
                <RadioButtons legend="Choisir le(s) siége(s)" name='isSelectSeat'
                              options={OptionBooleans}
                              register={register("isSelectSeat")}
                              error={errors.isSelectSeat?.message}/>
                <RadioButtons legend="Mobilité réduite" name='isReducedMobility'
                              options={OptionBooleans}
                              register={register("isReducedMobility")}
                              error={errors.isSelectSeat?.message}/>
                {isChooseSeats === 'true' && isLoading &&
                    <PageLoading message="chargement de la liste des sièges disponibles"/>}
                {isChooseSeats === 'true' && !isLoading &&
                    <SelectField label="Siéges" name="seats" register={register("seats")}
                                 options={formatToSelectOption(seats.filter((seat) => isReducedMobility === 'true' ? seat.reducedMobilitySeat : !seat.reducedMobilitySeat) || [], 'id', 'name')}
                                 error={errors.seats?.message || error?.message}
                                 className="w-full"
                                 placeholder="Choisissez les sieges"
                                 multiple
                    />
                }
                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default ReservationForm;