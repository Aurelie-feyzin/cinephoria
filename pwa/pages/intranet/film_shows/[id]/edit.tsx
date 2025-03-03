'use client';

import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import {fetchMovieById, updateMovieById} from "../../../../request/movie";
import React, {useState} from "react";
import PageIntranetContainer from "../../../../components/intranet/PageIntranetContainer";
import {SubmitHandler} from "react-hook-form";
import AlertError from "../../../../components/common/alert/AlertError";
import PageLoading from "../../../../components/common/PageLoading";
import MovieForm from "../../../../components/intranet/movies/MovieForm";
import {fetchMovieShowById, updateMovieShowById} from "../../../../request/movieShow";
import MovieShowForm from "../../../../components/intranet/filmShow/MovieShowForm";
import {useUser} from "../../../../context/UserContext";

const EditMoviePage = () => {
    const router = useRouter();
    const {refreshAccessToken} = useUser();
    const {id} = router.query;
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data: movieShowData, isLoading} = useQuery(
        ['movie_show', id],
        () => fetchMovieShowById(id as string),
        {
            enabled: !!id,
        }
    )

    const mutation = useMutation({
        mutationFn: (movieShowData: any) => updateMovieShowById(id as string, movieShowData, refreshAccessToken),
        onSuccess: () => {
            router.push(`/intranet/film_shows/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    return (
        <PageIntranetContainer titlePage='Editer une séance'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading /> :
                <MovieShowForm mutation={mutation} setMessageKo={setMessageKo} movieShowData={movieShowData}/>
            }
            </div>
        </PageIntranetContainer>
    )
}

export default EditMoviePage;