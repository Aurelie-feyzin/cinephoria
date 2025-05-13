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

const EditMoviePage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data: movieData, isLoading} = useQuery(
        ['movie', id],
        () => fetchMovieById(id as string),
        {
            enabled: !!id,
        }
    )

    const mutation = useMutation({
        mutationFn: (movieData: any) => updateMovieById(id as string, movieData),
        onSuccess: () => {
            router.push(`/intranet/movies/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })


    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            mutation.mutate(data)
        } catch (error) {
            setMessageKo("Erreur, film non modifié");
        }
    }

    return (
        <PageIntranetContainer titlePage='Editer un film'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading /> :
                <MovieForm mutation={mutation} setMessageKo={setMessageKo} movieData={movieData}/>
            }
            </div>
        </PageIntranetContainer>
    )
}

export default EditMoviePage;