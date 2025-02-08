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


const ReservationForm = ({filmShow}: { filmShow: MovieShowReservation }) => {
    const {register, handleSubmit, formState: {errors}, watch} = useForm<any, Error>(
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

    const {error, isLoading} = useQuery(
        ["seats", filmShow?.movieTheater["@id"]],
        () => fetchSeatsByMovieTheater(filmShow?.movieTheater["@id"]), {
            enabled: !!filmShow?.movieTheater["@id"],
            onSuccess: (data) => {
                setSeats(data['hydra:member']);

            }
        });

    const mutation = useMutation({
        mutationFn: (reservationData: any) => createReservation(reservationData),
        onSuccess: () => {
            router.push(`/orders`)
        },
        onError: () => {
            setMessageKo("Erreur, la réservation n'a pas été faite");
        },
    })

    const handleReservation: SubmitHandler<any> = async (data) => {
        try {
            const reservationData = {
                ...data,
                movieShow: `/movie_shows/${filmShow?.id}`
            }
            delete reservationData.isReducedMobility;
            delete reservationData.isSelectSeat;
            mutation.mutate(reservationData)
        } catch (error) {
            setMessageKo("Erreur, la réservation n'a pas été faite");
        }
    }


    return (
        <div className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md gap-4">
            <h2 className="text-secondary text-center font-bold text-xl">Réservation</h2>
            <AlertError visible={!!messageKo} message="Impossible de finaliser la réservation"/>
            <form className="max-w-full mx-auto" onSubmit={handleSubmit(handleReservation)}>
                <InputField
                    register={register("numberOfSeats", {...REQUIRED, ...customMin(1), ...customMax(filmShow.availableSeats)})}
                    type='number'
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
                {isChooseSeats === 'true' && isLoading && <PageLoading message="chargement de la liste des sièges disponibles" />}
                {isChooseSeats === 'true' && !isLoading &&
                    <SelectField label="Siéges" name="seats" register={register("seats")}
                                 options={formatToSelectOption(seats.filter((seat) => isReducedMobility === 'true' ? seat.reducedMobilitySeats : !seat.reducedMobilitySeats) || [], 'id', 'name')}
                                 error={errors.seats?.message || error}
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