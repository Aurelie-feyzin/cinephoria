import React, {useEffect, useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import {useQuery} from "react-query";
import dayjs from "dayjs";
import FullMovieCard from "../components/common/FullMovieCard";
import {useForm} from "react-hook-form";
import {orderBy, uniqBy} from "lodash";
import {fetchMovieInCinema} from "../request/movie";
import SelectCinema from "../components/common/form/SelectCinema";
import SelectDay from "../components/common/form/SelectDay";
import PageLoading from "../components/common/PageLoading";
import PageError from "../components/common/PageError";
import {fetchMovieShowByMovie} from "../request/movieShow";


const Movies = () => {
    const [movies, setMovies] = useState<MovieDescription[]>([]);
    const [genres, setGenres] = useState<MovieGenre[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MovieDescription | null>(null);
    const [movieShows, setMovieShows] = useState<MovieShowReservation[]>([]);
    const {register, watch} = useForm();
    const [filteredMovies, setFilteredMovies] = useState(movies);
    const selectedCinema = watch('cinema');
    const selectedGenre = watch('genre');
    const selectedDay = watch('day');
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const [after, setAfter] = useState(today);
    const [before, setBefore] = useState(now.add(6, 'day').format('YYYY-MM-DD'));
    const {error, isLoading} = useQuery(
        ["movie_in_cinemas", after, before, selectedCinema],
        () => fetchMovieInCinema(after, before, selectedCinema), {
            onSuccess: (data) => {
                const newMovies = data["hydra:member"];
                setMovies(newMovies);
                setGenres(orderBy(uniqBy(newMovies.map((movie: MovieDescription) => movie.genres).flat(), '@id'), 'name'));
            }
        });

    const {error: errorFilmShows, isLoading: isLoadingFilmShows} = useQuery(
        ["movie_shows", selectedMovie, after, before, selectedCinema],
        () => fetchMovieShowByMovie(selectedMovie['@id'], after, before, selectedCinema),
        {
            enabled: !!selectedMovie && !!before && !!after,
            onSuccess: (data) => {
                setMovieShows(data["hydra:member"]);
            }
        });


    useEffect(() => {
        const fetchFilteredMovies = () => {
            let filtered = movies;

            if (selectedGenre) {
                filtered = filtered.filter((movie) => movie.genres.find((genre) => genre.name === selectedGenre));
            }

            setFilteredMovies(filtered);
        };

        fetchFilteredMovies();
    }, [movies, selectedGenre]);

    return <PageContainer title='les films' titlePage="Actuellement en salle">
        <div className="container mx-auto p-6">
            {isLoading && <PageLoading/>}
            {error && <PageError message="Erreur lors de la récupération des films"/>}
            <form className="flex flex-col md:flex-row md:space-x-4 mb-6">
                <div className="w-full md:w-1/3">
                    <SelectCinema forceSelect={false} register={register}/>
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
                    <SelectDay register={register} now={now} setAfter={setAfter} setBefore={setBefore} selectedDay ={selectedDay}/>
                </div>
            </form>
            <div className="grid grid-cols-1">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div key={movie['@id']} onClick={() => setSelectedMovie(movie)}>
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
                        {orderBy(movieShows, ['movieTheater.cinema.name', 'date'])
                            .map((show: MovieShowReservation) => (
                                <li key={show.id} className="mt-2">
                                    {`Le ${dayjs(show.date).format('DD/MM/YYYY')} de ${show.startTime} à ${show.endTime}
                                     (${show.movieTheater.projectionQuality.name} - ${show.priceInEuros}€)`}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    </PageContainer>
};
export default Movies;
