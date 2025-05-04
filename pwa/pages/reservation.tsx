import React, {useEffect, useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import dayjs from "dayjs";
import {useForm} from "react-hook-form";
import SelectDay from "../components/common/form/SelectDay";
import SelectCinema from "../components/common/form/SelectCinema";
import AlertInfo from "../components/common/alert/AlertInfo";
import {orderBy} from "lodash";
import FullMovieCard from "../components/common/FullMovieCard";
import {useUser} from "../context/UserContext";
import Link from "next/link";
import ReservationForm from "../components/common/ReservationForm";
import {useQuery} from "react-query";
import {fetchMovieInCinema} from "../request/movie";
import {fetchMovieShowByMovie} from "../request/movieShow";
import PageLoading from "../components/common/PageLoading";
import PageError from "../components/common/PageError";
import {MovieShowReservation, MovieShowReservationApiResponse} from "../model/MovieShow";
import {ApiResponse} from "../model/ApiResponseType";
import {MovieDescription} from "../model/MovieInterface";

const Reservation = () => {
    const {user} = useUser();
    const {register, watch} = useForm<any, Error>({
        defaultValues: {
            cinema: localStorage.getItem("selectedCinema") || '',
            ["day-filter"]: localStorage.getItem("selectedDay") || undefined,
            movie:localStorage.getItem("selectedMovieId") || '',
        }
    });
    const [movies, setMovies] = useState<MovieDescription[]>([]);
    const [movieShows, setMovieShows] = useState<MovieShowReservation[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MovieDescription | null>();
    const [selectedFilmShow, setSelectedFilmShow] = useState<MovieShowReservation | null>(null);
    const selectedCinema = watch('cinema', '');
    const selectedDay = watch('day');
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const [after, setAfter] = useState(today);
    const [before, setBefore] = useState(now.add(6, 'day').format('YYYY-MM-DD'));

    const {error, isLoading} = useQuery<ApiResponse<MovieDescription>, Error>(
        ["movie_in_cinema", after, before, selectedCinema],
        () => fetchMovieInCinema(after, before, selectedCinema), {
            enabled: !!selectedCinema && !!before && !!after,
            onSuccess: (data) => {
                const newMovies = data["hydra:member"];
                setMovies(orderBy(newMovies, 'title'));
            }
        });

    const {error: errorFilmShows, isLoading: isLoadingFilmShows} = useQuery<MovieShowReservationApiResponse, Error>(
        ["movie_shows", selectedMovie, after, before, selectedCinema],
        () => fetchMovieShowByMovie(selectedMovie?.['@id'] as string, after, before, selectedCinema),
        {
            enabled: !!selectedMovie && !!before && !!after,
            onSuccess: (data: MovieShowReservationApiResponse) => setMovieShows(data?.["hydra:member"] || []),
        });

    const handleMovieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value;
        setSelectedMovie(movies.find((movie) => movie['@id'] === id) || null);
        localStorage.setItem("selectedMovieId", id);
    };

    useEffect(() => {
        const savedCinemaId = localStorage.getItem("selectedMovieId");
        setSelectedMovie(movies.find((movie) => movie['@id'] === savedCinemaId) || null)
        const selectedFilmShow = localStorage.getItem("selectedFilmShow");
        if (selectedFilmShow) {
            setSelectedFilmShow(movieShows.find((show) => show.id === selectedFilmShow) || null)
        }
    }, [movieShows, movies]);

    useEffect(() => {
        localStorage.setItem("selectedCinema", selectedCinema);
    }, [selectedCinema]);

    useEffect(() => {
        localStorage.setItem("selectedDay", selectedDay);
    }, [selectedDay]);

    return (<PageContainer title='réservation'>
            <div className="container mx-auto p-6">
                <form className="flex flex-col md:flex-row md:space-x-4 mb-2">
                    <div className="w-full md:w-1/2 mb-2">
                        <SelectCinema forceSelect={true} register={register}/>
                    </div>

                    <div className="w-full md:w-1/2">
                        <SelectDay register={register} selectedDay={selectedDay} setBefore={setBefore}
                                   setAfter={setAfter} now={now}/>
                    </div>
                </form>
                <div className="grid grid-cols-1">
                    {
                        selectedCinema ?
                            <div className="w-full mb-2">
                                <label htmlFor="movie-filter" className="block text-secondary font-semibold mb-2">
                                    Films
                                </label>
                                <select
                                    id="movie-filter"
                                    className="w-full p-2 border rounded-md"
                                    onChange={handleMovieChange}
                                    value={selectedMovie?.['@id'] || undefined}
                                >
                                    <option value='' disabled selected>Sélectionner un film</option>
                                    {movies.map((movie: MovieDescription) => (
                                        <option key={movie['@id']} value={movie['@id']}>
                                            {movie.title}
                                        </option>
                                    ))}
                                </select>
                                {isLoading &&
                                    <p role="alert" className="block text-white text-sm">Liste des films en cours de chargement</p>}
                                {error && <p role="alert" className="block text-white text-sm">{error.message}</p>}
                            </div> :
                            <AlertInfo visible={!selectedCinema}
                                       titleMessage="Merci de sélectionnez un cinéma pour voir la liste des films disponibles."/>
                    }


                    <AlertInfo visible={selectedCinema && movies.length === 0} titleMessage="Aucun film trouvé avec les filtres
                        sélectionnés."/>
                    {selectedMovie && (
                        <FullMovieCard key={selectedMovie['@id']} movie={selectedMovie}/>)
                    }
                </div>

                {selectedMovie && (
                    <div
                        className="bg-black text-white rounded-lg shadow-md overflow-hidden p-6">
                                <h2 className="text-xl font-bold text-secondary text-center">
                                    Séance dans le
                                    cinéma {movieShows.find((movieShow) => movieShow.movieTheater.cinema["@id"] === selectedCinema)?.movieTheater.cinema.name}
                                </h2>

                            <div className="justify-between items-center m-4">
                                <ul className="mb-4">
                                    {isLoadingFilmShows && <PageLoading message="Séances en cours de chargement" />}
                                    {errorFilmShows && <PageError message="Erreur pendant la récupération des séances" />}
                                    {orderBy(movieShows, ['movieTheater.cinema.name', 'date'])
                                        .map((show: MovieShowReservation) => (
                                            <li key={show.id} className="mt-2">
                                                {`Le ${dayjs(show.date).format('DD/MM/YYYY')} de ${show.startTime} à ${show.endTime}
                                     (${show.movieTheater.projectionQuality.name} - ${show.priceInEuros}€)`}
                                                <button
                                                    type='button'
                                                    onClick={() => setSelectedFilmShow(show)}
                                                    className="ml-2 mt-2 px-2 bg-primary text-white rounded hover:bg-secondary disabled:bg-gray-400"
                                                    disabled={!user}
                                                >Réserver
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                                <AlertInfo visible={!user} titleMessage='Connection obligatoire'>
                                    <p>Il faut être connecté pour réserver
                                        <Link href="/signIn"
                                              className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary ml-2">
                                            Se connecter
                                        </Link></p>
                                </AlertInfo>
                                {selectedFilmShow &&
                                    <ReservationForm filmShow={selectedFilmShow}/>
                                }
                            </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
export default Reservation;