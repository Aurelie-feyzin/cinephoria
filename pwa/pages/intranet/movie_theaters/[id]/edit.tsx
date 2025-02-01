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
import MovieTheaterForm from "../../../../components/intranet/movieTheater/MovieTheaterForm";
import {fetchMovieTheaterById, updateMovieTheater} from "../../../../request/movieTheater";

const EditMoviePage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data: movieTheaterData, isLoading} = useQuery(
        ['movie_theater', id],
        () => fetchMovieTheaterById(id as string),
        {
            enabled: !!id,
        }
    )

    const mutation = useMutation({
        mutationFn: (movieShowData: any) => updateMovieTheater(id as string, movieShowData),
        onSuccess: () => {
            router.push(`/intranet/movie_theaters/${id}`)
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    return (
        <PageIntranetContainer titlePage='Editer une salle'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading /> :
                    <MovieTheaterForm mutation={mutation} setMessageKo={setMessageKo} movieTheaterData={movieTheaterData}/>
            }
            </div>
        </PageIntranetContainer>
    )
}

export default EditMoviePage;