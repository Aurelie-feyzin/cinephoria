import React, {useState} from "react";

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

const Reservation = () => {
    const {user} = useUser();
    const {register, watch} = useForm<any, Error>({
        defaultValues: {
            cinema: '',
            ["day-filter"]: undefined,
            movie: undefined
        }
    });
    const [movies, setMovies] = useState<MovieDescription[]>([]);
    const [movieShows, setMovieShows] = useState<MovieShowReservation[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MovieDescription | null>(null);
    const [selectedFilmShow, setSelectedFilmShow] = useState<MovieShowReservation | null>(null);
    const selectedCinema = watch('cinema', '');
    const selectedDay = watch('day');
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const [after, setAfter] = useState(today);
    const [before, setBefore] = useState(now.add(6, 'day').format('YYYY-MM-DD'));


    const {error, isLoading} = useQuery(
        ["movie_in_cinema", after, before, selectedCinema],
        () => fetchMovieInCinema(after, before, selectedCinema), {
            enabled: !!selectedCinema && !!before && !!after,
            onSuccess: (data) => {
                const newMovies = data["hydra:member"];
                setMovies(newMovies);
            }
        });

    const {error: errorFilmShows, isLoading: isLoadingFilmShows} = useQuery<FullMovieShowApiResponse>(
        ["movie_shows", selectedMovie, after, before, selectedCinema],
        () => fetchMovieShowByMovie(selectedMovie['@id'], after, before, selectedCinema),
        {
            enabled: !!selectedMovie && !!before && !!after,
            onSuccess: (data: FullMovieShowApiResponse) => setMovieShows(data?.["hydra:member"] || []),
        });

    return (<PageContainer title='réservation'>
            <div className="container mx-auto p-6">
                <form className="flex flex-col md:flex-row md:space-x-4 mb-6">
                    <div className="w-full md:w-1/2">
                        <SelectCinema forceSelect={true} register={register}/>
                    </div>

                    <div className="w-full md:w-1/2">
                        <SelectDay register={register} selectedDay={selectedDay} setBefore={setBefore}
                                   setAfter={setAfter} now={now}/>
                    </div>
                </form>
                <div className="grid grid-cols-1">
                    <AlertInfo visible={!selectedCinema}
                               titleMessage="Merci de sélectionnez un cinéma pour voir la liste des films disponibles."/>
                    <AlertInfo visible={selectedCinema && movies.length === 0} titleMessage="Aucun film trouvé avec les filtres
                        sélectionnés."/>
                    {movies.map((movie) => (
                        <div key={movie['@id']} onClick={() => setSelectedMovie(movie)}>
                            <FullMovieCard key={movie['@id']} movie={movie}/>
                        </div>
                    ))
                    }
                </div>

                {selectedMovie && (
                    <div
                        className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg md:inset-y-0 md:right-0 md:top-0 md:w-1/3">
                        <button onClick={() => setSelectedMovie(null)} className="text-gray-500">
                            Fermer
                        </button>
                        <h2 className="text-xl font-semibold">{movieShows.find((movieShow) => movieShow.movieTheater.cinema["@id"] === selectedCinema)?.movieTheater.cinema.name} - {selectedMovie.title}</h2>
                        <ul className="mb-4">
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
                                      className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary ml-1">
                                    Se connecter
                                </Link></p>
                        </AlertInfo>
                        {selectedFilmShow &&
                            <ReservationForm filmShow={selectedFilmShow}/>
                        }
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
export default Reservation;