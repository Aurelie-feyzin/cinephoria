import {useRouter} from "next/router";
import React, {useState} from "react";
import AlertError from "../../../components/common/alert/AlertError";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation} from "react-query";
import MovieTheaterForm from "../../../components/intranet/movieTheater/MovieTheaterForm";
import {createMovieTheater} from "../../../request/movieTheater";


const CreateMovieTheater = () => {
    const router = useRouter();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const mutation = useMutation({
        mutationFn: (movieTheaterData: any) => createMovieTheater(movieTheaterData),
        onSuccess: (response) => {
            const id = response.id
            router.push(`/intranet/movie_theaters/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la création');
        },
    })

    return (
        <PageIntranetContainer titlePage='Ajouter une salle'>
            <div className="min-w-full mb-4">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                <MovieTheaterForm mutation={mutation} setMessageKo={setMessageKo}/>
            </div>
        </PageIntranetContainer>
    )

}

export default CreateMovieTheater;

