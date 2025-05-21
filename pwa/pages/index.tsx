'use client';

import React, {useState} from "react";
import {useQuery} from "react-query";
import PageContainer from "../components/common/layout/PageContainer";
import MovieCard from "../components/common/MovieCard";
import PageLoading from "../components/common/PageLoading";
import PageError from "../components/common/PageError";
import {fetchNewMovies} from "../request/movie";
import {Movie} from "../model/MovieInterface";

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [orphanLastMovie, setOrphanLastMovie] = useState(false);

    const {error, isLoading} = useQuery("new_movies", fetchNewMovies, {
        onSuccess: (data) => {
            const newMovies = data["hydra:member"];
            setMovies(newMovies);
            setOrphanLastMovie(newMovies ? newMovies?.length % 2 != 0 : false);
        }
    });

    return (
        <PageContainer
            title='les nouveautés'
            titlePage='Nos nouveautés de la semaine'
        >
            <>
                {isLoading && <PageLoading message="En cours de chargement" />}
                {error && <PageError message="Impossible de récupérer les nouveautés de la semaine" />}
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {movies.map((movie, index, {length}) => (
                            index === length - 1 && orphanLastMovie ?
                                <></>
                                :
                                <div className="flex flex-col items-center space-y-6" key={movie['@id']}>
                                    <MovieCard movie={movie} />
                                </div>
                        ))
                        }
                    </div>
                    {orphanLastMovie &&
                        <div className="flex flex-col items-center space-y-6" key={movies[movies.length - 1]['@id']}>
                            <MovieCard movie={movies[movies.length - 1]} />
                        </div>}
                </div>

            </>
        </PageContainer>
    )
}

export default HomePage;
