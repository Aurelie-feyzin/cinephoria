import {UseMutationResult, useQuery} from "react-query";
import {fetchMovieGenres} from "../../../request/movieGenre";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../../common/form/InputField";
import {customMaxLength, REQUIRED} from "../../common/form/validator_tools";
import TextAreaField from "../../common/form/TextAreaField";
import SelectField from "../../common/form/SelectField";
import {formatToSelectOption, Option} from "../../common/form/utils";
import RadioButtons, {OptionBooleans} from "../../common/form/RadioButtons";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import dayjs from "dayjs";
import {fetchEnums, URL_ENUM} from "../../../request/api";
import {MovieDescription, MovieDescriptionInput, MovieTmdb} from "../../../model/MovieInterface";
import {MovieGenre} from "../../../model/MovieGenreInterface";
import {fetchTmdbDetailMovie, searchTmdbMovies} from "../../../request/movie";
import LinkIcon from "../../common/Icon/LinkIcon";
import {unset} from "lodash";


const MovieForm = ({movieData, setTmdbId, tmdbId, mutation, setMessageKo}:
                   {
                       movieData?: MovieDescription|MovieTmdb,
                       mutation: UseMutationResult,
                       setMessageKo: SetStateAction<any>,
                       setTmdbId?:  Dispatch<SetStateAction<number | null>>,
                       tmdbId?:  number|null
                   }) => {
    const {data: ageRestrictions, error: errorAge, isLoading: isLoadinAge} = useQuery(
        ['age_registrations'], () => fetchEnums(URL_ENUM.age_restriction),
    )
    const {data: movieGenres, error: errorGenre, isLoading: isLoadinGenre} = useQuery(
        ['movie_genres'], () => fetchMovieGenres(),
    )
    const [tmdbMovie, setTmdbMovie] = useState<MovieTmdb|undefined>(undefined);
    const {error: errorMovieTmdb, isLoading: isLoadingTmdb } = useQuery<MovieTmdb, Error>(
        ['tmdbMovie', tmdbId],
        () => fetchTmdbDetailMovie(tmdbId as number),
        {
            onSuccess: (data) => setTmdbMovie(data),
            enabled: !!tmdbId,
        }
    );

    const formValues = (movieData ?: MovieDescription|MovieTmdb) => {
        return movieData ? {
            ...movieData,
            releaseDate: movieData.releaseDate ? dayjs(movieData.releaseDate).format('YYYY-MM-DD') : undefined,
            genres: movieData.genres?.length > 0 ? movieData.genres.map((genre: MovieGenre) => genre['@id']) : [],
            ageRestriction: movieData.ageRestriction ? movieData.ageRestriction['@id'] : undefined,
            warning: String(!!movieData.warning),
            favorite: movieData.favorite ? String(movieData?.favorite) : undefined,
        } : {}
    }

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors},
    } = useForm<MovieDescriptionInput>({
        defaultValues: formValues(movieData),
    },);
    const movieTitle = watch('title');

    const [searchTitle, setSearchtitle] = useState<string|null>(null);

    const {data: movies, error, isLoading } = useQuery<MovieTmdb[], Error>(
        ['searchTmdbMovie', searchTitle],
        () => searchTmdbMovies(searchTitle as string),
        {
            enabled: !!searchTitle,
            onSuccess: (data) => {
                if (data.length === 1 && setTmdbId) {
                    setTmdbId(data[0]['idTmdb'])
                }
            }
        },
    )


    useEffect(() => {
        let newMovieData = undefined;
        if (movieData) {
            newMovieData = movieData;
        }
        if (tmdbMovie) {
            newMovieData = tmdbMovie;
            unset(newMovieData, '@context');
            unset(newMovieData, '@id');
            unset(newMovieData, '@type');
            unset(newMovieData, 'idTmdb');
        }
        reset(formValues(newMovieData));
        if (newMovieData?.releaseDate) {
            const releaseDate =  dayjs(newMovieData?.releaseDate);
            if (releaseDate.day() === 3) {
                getDates([{
                    id: releaseDate.format('YYYY-MM-DD'),
                    value: releaseDate.format('YYYY-MM-DD'),
                    label: releaseDate.format('DD/MM/YYYY'),
                }]);
            }
        }
    }, [movieData, tmdbMovie, reset]);
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            data = {
                ...data,
                // Convert the string value of ('true' or 'false') to a boolean
                favorite: data.favorite === 'true',
                warning: data.warning === 'true',
            }
            mutation.mutate(data)
        } catch (error) {
            setMessageKo("Erreur, film non modifié");
        }
    }

    const getDates = (optionDates: Option[] = []) => {
        const now = dayjs();
        const wednesday = now.day(3);
        let nbAddDate = 4;
        if (wednesday.format('YYYY-MM-DD') >= now.format('YYYY-MM-DD')) {
            nbAddDate = 3;
            optionDates.push({
                id: wednesday.format('YYYY-MM-DD'),
                value: wednesday.format('YYYY-MM-DD'),
                label: wednesday.format('DD/MM/YYYY'),
            });
        }
        for (let i = 1; i < (nbAddDate+1); i++) {
            const newDate = wednesday.add(i*7, 'day');
            optionDates.push({
                id: newDate.format('YYYY-MM-DD'),
                value: newDate.format('YYYY-MM-DD'),
                label: newDate.format('DD/MM/YYYY'),
            });
        }

        return optionDates;
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
                <InputField
                    register={register("title", {...REQUIRED, ...customMaxLength(255)})}
                    name='title'
                    label='Titre'
                    error={errors.title?.message}
                    type='search'
                >
                    <div className="mt-2 text-white">
                    {tmdbMovie && tmdbMovie.idTmdb && movieTitle &&
                        <button
                            className="inline-flex items-center gap-1"
                            onClick={() => {
                                if (setTmdbId) {
                                    setTmdbId(null);
                                }
                                setTmdbMovie(undefined);
                                reset(formValues()) }
                        } title='effacer le formulaire'>Effacer le formulaire<LinkIcon /></button>}
                    {!movieData && !tmdbMovie && movieTitle && <button className="inline-flex items-center gap-1" onClick={() => setSearchtitle(movieTitle)} title='rechercher avec tmdb'>Rechercher avec tmdb <LinkIcon /></button>}
                    {searchTitle && movieTitle && movies?.length === 0 && <span>Aucun film trouvé pour ce titre</span>}
                    </div>
                    {searchTitle && movies && movies?.length > 1 && (
                        <div className="mt-4 bg-white text-black rounded-lg shadow p-4 space-y-3">
                            <p className="font-semibold">Plusieurs films trouvés :</p>
                            <ul className="space-y-2">
                                {movies.map((movie: any) => (
                                    <li key={movie.idTmdb} className="flex justify-between items-start gap-4 border-b pb-2">
                                        <div>
                                            <div className="font-medium">{movie.title}</div>
                                            {movie.releaseDate && (
                                                <div className="text-sm text-gray-600">
                                                    Sortie : {dayjs(movie.releaseDate?.date).format('DD/MM/YYYY')}
                                                </div>
                                            )}
                                            {movie.description && (
                                                <div className="text-sm text-gray-500 line-clamp-2">
                                                    {movie.description}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => {
                                                reset(formValues(movie))
                                                if (setTmdbId) {
                                                    setTmdbId(movie.idTmdb)
                                                }
                                                setSearchtitle(null)
                                            }}
                                        >
                                            Choisir
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </InputField>
                <TextAreaField
                    register={register("description", {...REQUIRED})}
                    name='description'
                    label='Synopsis'
                    placeholder="Le synopsis du film"
                    error={errors.description?.message}
                />
                <InputField register={register("duration", {...REQUIRED, valueAsNumber: true})}
                            type="number"
                            name='duration'
                            label='Durée (min)'
                            error={errors.duration?.message}
                />
                <SelectField label="Date de sortie" name="releaseDate" register={register("releaseDate", {...REQUIRED,  valueAsDate: true})}
                             options={getDates() || []}
                             error={errors.releaseDate?.message}
                             className="w-full"
                >
                {tmdbMovie && dayjs(tmdbMovie.releaseDate).day() !== 3 &&
                        <span className="text-white">Date de sortie trouvée sur tmdb : {dayjs(tmdbMovie.releaseDate).format('DD/MM/YYYY')}
                        </span>}
                </SelectField>
                <SelectField label="Age minimun" name="ageRestriction" register={register("ageRestriction", {...REQUIRED})}
                             options={formatToSelectOption(ageRestrictions || [], '@id', 'value')}
                             error={errors.ageRestriction?.message}
                />
                <SelectField multiple label="Genres" name="genres" register={register("genres", {...REQUIRED})}
                             options={formatToSelectOption(movieGenres || [], '@id', 'name')}
                             error={errors.duration?.message}
                />
                <RadioButtons legend="Coup de coeur" name='favorite' options={OptionBooleans}
                              register={register("favorite")} error={errors.favorite?.message}/>
                <RadioButtons legend="Avertissement" name='warning' options={OptionBooleans}
                              register={register("warning")} error={errors.warning?.message}/>

                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default MovieForm;