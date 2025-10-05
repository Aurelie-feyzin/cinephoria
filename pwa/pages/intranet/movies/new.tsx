'use client';

import {useRouter} from "next/router";
import React, {useState} from "react";
import AlertError from "../../../components/common/alert/AlertError";
import MovieForm from "../../../components/intranet/movies/MovieForm";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation, useQuery} from "react-query";
import {
    createMovie,
    fetchUpcomingMovies,
} from "../../../request/movie";
import {MovieTmdb} from "../../../model/MovieInterface";
import LinkIcon from "../../../components/common/Icon/LinkIcon";
const CreateMovie = () => {
    const router = useRouter();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);
    const [tmdbId, setTmdbId] = useState<number|null>(null);
    const [upcomingMovies, setUpcomingMovies] = useState<MovieTmdb[]>([]);

    const { error: upcomingError, isLoading: upcomingIsLoading } = useQuery<any, Error>(
        'upcoming_movies', fetchUpcomingMovies, {
            onSuccess: (data) => {
                setUpcomingMovies(data?.['hydra:member'] || []);
            }
        },
    )

    const mutation = useMutation({
        mutationFn: (movieData: any) => createMovie(movieData),
        onSuccess: (response) => {
            const id = response.id
            router.push(`/intranet/movies/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    return (
        <PageIntranetContainer titlePage='Ajouter un film'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {
                    !upcomingError && !upcomingIsLoading && upcomingMovies?.length > 0 &&
                    <div className="mb-6 p-6 bg-white rounded-lg shadow-md space-y-4">
                        <strong>Films bientôt en salle :  </strong>
                        {upcomingMovies?.map((movie, index) => <>
                        <span key={movie.idTmdb}> {movie.title} </span>
                            <button onClick={() => setTmdbId(movie.idTmdb)}>
                                <LinkIcon colorText='black'/>
                            </button>
                                {index !== (upcomingMovies.length - 1) && ', '}
                            </>
                        )}
                    </div>
                }
                <MovieForm mutation={mutation} setMessageKo={setMessageKo} setTmdbId={setTmdbId} tmdbId={tmdbId}/>
            </div>
        </PageIntranetContainer>
    )

}

export default CreateMovie;