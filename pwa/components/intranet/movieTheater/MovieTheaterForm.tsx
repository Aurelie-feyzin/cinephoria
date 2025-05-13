import {UseMutationResult, useQuery} from "react-query";

import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../../common/form/InputField";
import {REQUIRED} from "../../common/form/validator_tools";
import SelectField from "../../common/form/SelectField";
import {formatToSelectOption} from "../../common/form/utils";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import React, {SetStateAction} from "react";
import {useCinemas} from "../../../context/CinemaContext";
import {fetchProjectionQualities} from "../../../request/projectionQuality";
import {MovieTheater, MovieTheaterInput} from "../../../model/movieTheater";
import {ProjectionQuality} from "../../../model/ProjectionQuality";

const MovieShowForm = ({movieTheaterData, mutation, setMessageKo}:
                       {
                           movieTheaterData?: MovieTheater,
                           mutation: UseMutationResult,
                           setMessageKo: SetStateAction<any>
                       }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<MovieTheaterInput, Error>({
        defaultValues: movieTheaterData ? {
            ...movieTheaterData,
            cinema: movieTheaterData ? movieTheaterData.cinema['@id'] : undefined,
            projectionQuality: movieTheaterData.projectionQuality ? movieTheaterData.projectionQuality['@id'] : undefined,
        } : {},
    },);

    const {cinemas, error: errorCinemas} = useCinemas();

    const {data: projectionQuality, error: errorProjectionQuality, isLoading: isLoadinProjectionQuality} = useQuery<ProjectionQuality[], Error>(
        ['projection_qualities'],
        () => fetchProjectionQualities(),
    );

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            data = {
                ...data,
            }
            mutation.mutate(data)
        } catch (error) {
            setMessageKo(movieTheaterData ? 'Erreur, salle non modifiée' : "Erreur impossible de créer la salle");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
                <SelectField label="Cinema" name="cinema" register={register("cinema", {...REQUIRED})}
                                 options={formatToSelectOption(cinemas || [], '@id', 'name')}
                                 error={errors.cinema?.message || errorCinemas?.message}
                                 className="w-full"
                                 placeholder="Choisissez un cinéma"
                    />
                <InputField register={register("theaterName", {...REQUIRED})}
                            name='theaterName'
                            label='Nom de la salle'
                            error={errors.theaterName?.message}
                            className="w-full"
                />
                <SelectField label="Qualité de projection" name="projectionQuality" register={register("projectionQuality", {...REQUIRED})}
                             options={formatToSelectOption(projectionQuality || [], '@id', 'name')}
                             error={errors.projectionQuality?.message || errorProjectionQuality?.message}
                             className="w-full"
                             placeholder="Choisissez une qualité"
                />
                <div className="flex max-w-full gap-4">
                    <InputField register={register("numberOfSeats", {...REQUIRED, valueAsNumber: true})}
                                type="number"
                                name='numberOfSeats'
                                label='Nombre de sièges'
                                error={errors.numberOfSeats?.message}
                                className="w-full"
                                disabled={!!movieTheaterData}
                    />
                    <InputField
                        register={register("reducedMobilitySeats", {...REQUIRED, valueAsNumber: true})}
                        type="number"
                        name='reducedMobilitySeats'
                        label='Dont mobilité réduite'
                        error={errors.reducedMobilitySeats?.message}
                        className="w-full"
                        disabled={!!movieTheaterData}
                    />
                </div>
                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default MovieShowForm;