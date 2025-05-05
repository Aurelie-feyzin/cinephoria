'use client';

import {UseMutationResult, useQuery} from "react-query";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../../common/form/InputField";
import {REQUIRED} from "../../common/form/validator_tools";
import SelectField from "../../common/form/SelectField";
import {formatToSelectOption} from "../../common/form/utils";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import React, {SetStateAction, useEffect, useState} from "react";
import dayjs from "dayjs";
import {fetchMovieByUri, fetchMoviesBySearchInTitle} from "../../../request/movie";
import {useCinemas} from "../../../context/CinemaContext";
import Autocomplete from "../../common/form/Autocomplete";
import {fetchMovieTheatersByCinema} from "../../../request/movieTheater";
import InputTimeField from "../../common/form/InputTimeField";
import {FullMovieShow, MovieShowInput} from "../../../model/MovieShow";
import {MovieDescription} from "../../../model/MovieInterface";

const MovieShowForm = ({movieShowData, mutation, setMessageKo}:
                       {
                           movieShowData?: FullMovieShow,
                           mutation: UseMutationResult,
                           setMessageKo: SetStateAction<any>
                       }) => {
    const {
        control,
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<MovieShowInput, Error>({
        defaultValues: movieShowData ? {
            ...movieShowData,
            movieTheater: movieShowData.movieTheater ? movieShowData.movieTheater['@id'] : undefined,
            movie: movieShowData.movie ? movieShowData.movie['@id'] : undefined,
            date: movieShowData.date ? dayjs(movieShowData.date).format('YYYY-MM-DD') : undefined,
            cinema: movieShowData.movieTheater ? movieShowData.movieTheater.cinema['@id'] : undefined,
        } : {},
    },);

    const watchCinema = watch("cinema");
    const watchMovie = watch("movie");
    const watchStartTime = watch("startTime");
    const [minEndTime, setMinEndTime] = useState<string | undefined>(undefined)
    const {cinemas} = useCinemas();
    const {data: movieTheaters, error: errorMovieTheaters, isLoading: isMovieTheaters} = useQuery<any, Error>(
        ['movie_theathers', watchCinema],
        () => fetchMovieTheatersByCinema(watchCinema),
        {
            enabled: !!watchCinema,
        },
    )

    const {data: movie, error: errorMovie, isLoading: isLoadinMovies} = useQuery<any, Error>(
        ['movie_theathers', watchMovie],
        () => fetchMovieByUri(watchMovie),
        {
            enabled: !!watchMovie,
        },
    );

    const getMinEndTime = (startTime: string, movieDuration: number): string => {
        const today = dayjs().startOf('day'); // Get the start of the current day (00:00:00)

        // Split the input startTime into hours and minutes and convert part to in integer
        const startTimeParts = startTime.split(':');
        const hours = parseInt(startTimeParts[0], 10);
        const minutes = parseInt(startTimeParts[1], 10);

        // Add the start time and movie duration to the current day
        return today
            .add(hours, 'hour')
            .add(minutes, 'minute')
            .add(movieDuration, 'minute')
            .format('HH:mm');
    }

    useEffect(() => {
        if (movie) {
            setMinEndTime(getMinEndTime(watchStartTime, movie.duration));
        }

    }, [movie, watchStartTime]);


    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            mutation.mutate(data)
        } catch (error) {
            setMessageKo("Erreur, séance non modifiée");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
                <div className="flex max-w-full gap-4">
                    <SelectField label="Cinema" name="cinema" register={register("cinema", {...REQUIRED})}
                                 options={formatToSelectOption(cinemas || [], '@id', 'name')}
                                 error={errors.cinema?.message}
                                 className="w-full"
                                 placeholder="Choisissez un cinéma"
                    />
                    <SelectField label="Salle" name="movieTheater" register={register("movieTheater", {...REQUIRED})}
                                 options={formatToSelectOption(movieTheaters || [], '@id', 'theaterName')}
                                 error={errors.movieTheater?.message}
                                 className="w-full"
                                 placeholder="Choisissez une salle"
                    />
                </div>

                <Autocomplete<MovieDescription>
                    control={control}
                    name="movie"
                    label="Film"
                    fetchSuggestions={fetchMoviesBySearchInTitle}
                    suggestionField="title"
                    initialSuggestion={movieShowData?.movie ? {
                        '@id': movieShowData.movie['@id'],
                        title: movieShowData.movie.title
                    } : undefined}
                />
                <div className="flex max-w-full gap-4">
                    <InputField register={register("date", {...REQUIRED, valueAsDate: true})}
                                type="date"
                                name='date'
                                label='Date de la séance'
                                error={errors.date?.message}
                                className="w-full"
                    />
                    <InputTimeField
                        register={register("startTime", {...REQUIRED})}
                        name='startTime'
                        label='Début séance'
                        error={errors.startTime?.message}
                        className="w-full"
                    />
                    <InputTimeField
                        register={register("endTime", {...REQUIRED})}
                        name='endTime'
                        label='Fin séance'
                        error={errors.endTime?.message}
                        minValue={minEndTime}
                        className="w-full"
                    />
                </div>
                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default MovieShowForm;