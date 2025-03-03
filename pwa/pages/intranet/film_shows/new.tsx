'use client';

import {useRouter} from "next/router";
import React, {useState} from "react";
import AlertError from "../../../components/common/alert/AlertError";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation} from "react-query";
import {createMovieShow} from "../../../request/movieShow";
import MovieShowForm from "../../../components/intranet/filmShow/MovieShowForm";
import {useUser} from "../../../context/UserContext";


const CreateMovieShow = () => {
    const router = useRouter();
    const {refreshAccessToken} = useUser();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const mutation = useMutation({
        mutationFn: (movieData: any) => createMovieShow(movieData, refreshAccessToken),
        onSuccess: (response) => {
            const id = response['id']
            router.push(`/intranet/film_shows/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    return (
        <PageIntranetContainer titlePage='Ajouter une séance'>
            <div className="min-w-full mb-4">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                <MovieShowForm mutation={mutation} setMessageKo={setMessageKo}/>
            </div>
        </PageIntranetContainer>
    )

}

export default CreateMovieShow;

