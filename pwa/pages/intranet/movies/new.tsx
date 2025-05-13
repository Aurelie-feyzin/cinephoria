'use client';

import {useRouter} from "next/router";
import React, {useState} from "react";
import AlertError from "../../../components/common/alert/AlertError";
import MovieForm from "../../../components/intranet/movies/MovieForm";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation} from "react-query";
import {createMovie} from "../../../request/movie";


const CreateMovie = () => {
    const router = useRouter();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

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
                <MovieForm mutation={mutation} setMessageKo={setMessageKo} />
            </div>
        </PageIntranetContainer>
    )

}

export default CreateMovie;