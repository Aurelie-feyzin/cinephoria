import React, {useEffect, useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import {useQuery} from "react-query";
import dayjs from "dayjs";
import FullMovieCard from "../components/common/FullMovieCard";
import {useForm} from "react-hook-form";
import {useCinemas} from "../context/CinemaContext";
import {orderBy, uniqBy} from "lodash";
import {fetchMovieInCinema} from "../request/movie";
import PageLoading from "../components/common/PageLoading";
import PageError from "../components/common/PageError";


const Movies = () => {
    const {cinemas} = useCinemas();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<MovieGenre[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const {register, watch} = useForm();
    const [filteredMovies, setFilteredMovies] = useState(movies);
    const selectedCinema = watch('cinema');
    const selectedGenre = watch('genre');
    const selectedDay = watch('day');
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const lastDay = now.add(6, 'day').format('YYYY-MM-DD');
    const {error, isLoading} = useQuery("movie_in_cinema", () => fetchMovieInCinema(today, lastDay), {
        onSuccess: (data) => {
            const newMovies = data["hydra:member"];
            setMovies(newMovies);
            setGenres(orderBy(uniqBy(newMovies.map((movie: Movie) => movie.genres).flat(), '@id'), 'name'));
        }
    });

    const daysOfWeek = [
        {label: 'Tous les jours', value: ''},
        {label: 'Lundi', value: 1},
        {label: 'Mardi', value: 2},
        {label: 'Mercredi', value: 3},
        {label: 'Jeudi', value: 4},
        {label: 'Vendredi', value: 5},
        {label: 'Samedi', value: 6},
        {label: 'Dimanche', value: 0},
    ];

    useEffect(() => {
        const fetchFilteredMovies = () => {
            let filtered = movies;

            if (selectedCinema) {
                filtered = filtered.filter((movie) => movie.movieShows.filter((show) =>
                    show.movieTheater.cinema.name === selectedCinema
                    && dayjs(show.date).format('YYYY-MM-DD') >= today
                    && dayjs(show.date).format('YYYY-MM-DD') <= lastDay
                ).length > 0);
            }

            if (selectedGenre) {
                filtered = filtered.filter((movie) => movie.genres.find((genre) => genre.name === selectedGenre));
            }

            if (selectedDay) {
                filtered.map((movie) =>
                    movie.movieShows.find((show) =>
                        dayjs(show.date).day() == selectedDay
                    ));
                filtered = filtered.filter((movie) => movie.movieShows.find((show) =>
                    new Date(show.date).getDay() == selectedDay
                    && dayjs(show.date).format('YYYY-MM-DD') >= today
                    && dayjs(show.date).format('YYYY-MM-DD') <= lastDay
                ));
            }

            setFilteredMovies(filtered);
        };

        fetchFilteredMovies();
    }, [selectedCinema, selectedGenre, selectedDay, movies, today, lastDay]);

    return <PageContainer title='les films' titlePage="Actuellement en salle">
        <div className="container mx-auto p-6">
            <form className="flex flex-col md:flex-row md:space-x-4 mb-6">
                <div className="w-full md:w-1/3">
                    <label htmlFor="cinema-filter" className="block text-secondary font-semibold mb-2">
                        Cinéma
                    </label>
                    <select
                        id="cinema-filter"
                        {...register('cinema')}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Tous les cinémas</option>
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.name}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="genre-filter" className="block text-secondary font-semibold mb-2">
                        Genre
                    </label>
                    <select
                        id="genre-filter"
                        {...register('genre')}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Tous les genres</option>
                        {genres.map((genre: MovieGenre) => (
                            <option key={genre['@id']} value={genre.name}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="day-filter" className="block text-secondary font-semibold mb-2">
                        Jour
                    </label>
                    <select
                        id="day-filter"
                        {...register('day')}
                        className="w-full p-2 border rounded-md"
                    >
                        {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                                {day.label}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
            <div className="grid grid-cols-1">
                {isLoading && <PageLoading message="Chargement des films en cours"/>}
                {error && <PageError message={error?.message}/>}
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div key={movie.id} onClick={() => setSelectedMovie(movie)}>

                            <FullMovieCard key={movie.id} movie={movie}/>

                        </div>

                    ))
                ) : (
                    <p className="text-gray-700 col-span-full text-center">Aucun film trouvé avec les filtres
                        sélectionnés.</p>
                )}
            </div>
            {selectedMovie && (
                <div
                    className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg md:inset-y-0 md:right-0 md:top-0 md:w-1/3">
                    <button onClick={() => setSelectedMovie(null)} className="text-gray-500">
                        Fermer
                    </button>
                    <h2 className="text-xl font-semibold">{selectedMovie.title}</h2>
                    <ul>
                        {orderBy(selectedMovie.movieShows, ['movieTheater.cinema.name', 'date'])
                            .filter((show: MovieShow) => dayjs(show.date).format('YYYY-MM-DD') >= today && dayjs(show.date).format('YYYY-MM-DD') <= lastDay)
                            .filter((show: MovieShow) => {
                                if (selectedCinema && show.movieTheater.cinema.name !== selectedCinema) {
                                    return false;
                                }
                                return !(selectedDay && new Date(show.date).getDay() != selectedDay);
                            })
                            .map((show: MovieShow) => (
                                <li key={show['@id']} className="mt-2">
                                    {show.movieTheater.cinema.name} {dayjs(show.date).format('DD/MM/YYYY')} {show.startTime} {show.endTime} {show.movieTheater.projectionQuality.name}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    </PageContainer>
};
export default Movies;
