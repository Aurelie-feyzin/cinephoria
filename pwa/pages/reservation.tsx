import React, {useCallback, useEffect, useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import dayjs from "dayjs";
import {useForm} from "react-hook-form";
import SelectDay from "../components/common/form/SelectDay";
import SelectCinema from "../components/common/form/SelectCinema";
import AlertInfo from "../components/common/alert/AlertInfo";
import {fetchMovieShowInCinema} from "../request/movieShow";
import {orderBy, uniqBy} from "lodash";
import FullMovieCard from "../components/common/FullMovieCard";

const Reservation = () => {
    const { register, watch } = useForm<any, Error>({
        defaultValues: {
            cinema: '',
            ["day-filter"]: undefined,
            movie: undefined
        }
    });
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieShows, setMovieShows] = useState<MovieShowReservation[]>([]);
    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [selectedMovie, setSelectedMovie] = useState<Movie|null>(null);
    const selectedCinema = watch('cinema', '');
    const selectedDay = watch('day');
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const lastDay = now.add(6, 'day').format('YYYY-MM-DD');

    const fetchFilteredMovies = useCallback(() => {
        let filtered = movieShows.filter((show) =>
            show.movieTheater.cinema['@id'] === selectedCinema
            && dayjs(show.date).format('YYYY-MM-DD') >= today
            && dayjs(show.date).format('YYYY-MM-DD') <= lastDay
        );

        if (selectedDay) {
            filtered = movieShows.filter((show) =>
                new Date(show.date).getDay() == selectedDay
                && dayjs(show.date).format('YYYY-MM-DD') >= today
                && dayjs(show.date).format('YYYY-MM-DD') <= lastDay
            );
        }
        setFilteredMovies(orderBy(uniqBy(filtered.map((movieShow: any) => movieShow.movie), '@id'), 'title'));
    },[lastDay, movieShows, selectedCinema, selectedDay, today]);

    const getMovies = useCallback(async () => {
        const response = await fetchMovieShowInCinema(selectedCinema, today, lastDay);
        const initalMovieShows = response['hydra:member']
        setMovieShows(initalMovieShows);
        const initialMovies = orderBy(uniqBy(initalMovieShows.map((movieShow: any) => movieShow.movie), '@id'), 'title');
         setMovies(initialMovies);
         fetchFilteredMovies();
    }, [fetchFilteredMovies, lastDay, selectedCinema, today]);

    useEffect(() => {
        if (selectedCinema) {
            getMovies().then();
        } else {
            setMovies([]);
            setFilteredMovies([]);
        }
    }, [getMovies, selectedCinema]);

    useEffect(() => {
         fetchFilteredMovies();
    }, [selectedDay, movieShows, fetchFilteredMovies]);

    return (<PageContainer title='réservation'>
        <div className="container mx-auto p-6">
            <form className="flex flex-col md:flex-row md:space-x-4 mb-6">
                <div className="w-full md:w-1/2">
                    <SelectCinema forceSelect={true} register={register} />
                </div>

                <div className="w-full md:w-1/2">
                    <SelectDay register={register} />
                </div>
            </form>
            <div className="grid grid-cols-1">
                <AlertInfo visible={!selectedCinema} titleMessage="Merci de sélectionnez un cinéma pour voir la liste des films disponibles." />
                <AlertInfo visible={selectedCinema && filteredMovies.length === 0} titleMessage="Aucun film trouvé avec les filtres
                        sélectionnés." />
                {filteredMovies.map((movie) => (
                        <div key={movie['@id']} onClick={() => setSelectedMovie(movie)}>
                            <FullMovieCard key={movie['@id']} movie={movie} />
                        </div>
                    ))
                }
           </div>

            {selectedMovie && (
                <div className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg md:inset-y-0 md:right-0 md:top-0 md:w-1/3">
                    <button onClick={() => setSelectedMovie(null)} className="text-gray-500">
                        Fermer
                    </button>
                    <h2 className="text-xl font-semibold">{selectedMovie.title}</h2>
                    <ul>
                        {orderBy(movieShows, ['movieTheater.cinema.name', 'date'])
                            .filter((show: MovieShowReservation) => show.movie['@id'] === selectedMovie['@id'])
                            .filter((show: MovieShowReservation) => dayjs(show.date).format('YYYY-MM-DD') >= today && dayjs(show.date).format('YYYY-MM-DD') <= lastDay)
                            .filter((show: MovieShowReservation)=> {
                                if (selectedCinema && show.movieTheater.cinema['@id'] !== selectedCinema) {
                                    return false;
                                }
                                return !(selectedDay && new Date(show.date).getDay() != selectedDay);
                            })
                            .map((show: MovieShowReservation) => (
                                <li key={show['@id']} className="mt-2">
                                    {show.movieTheater.cinema.name} {dayjs(show.date).format('DD/MM/YYYY')} {show.startTime} {show.endTime} {show.movieTheater.projectionQuality.name}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    </PageContainer>
);
}
export default Reservation;