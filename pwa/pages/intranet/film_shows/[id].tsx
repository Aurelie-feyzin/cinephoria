import {useRouter} from 'next/router'
import {useQuery} from "react-query";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import React from "react";
import PropertyInline from "../../../components/common/layout/PropertyInline";
import {fetchMovieShowById} from "../../../request/movieShow";
import dayjs from "dayjs";
import ButtonEdit from "../../../components/common/button/ButtonEdit";
import {FullMovieShow} from "../../../model/MovieShow";

const MoviePage = () => {
    const router = useRouter()
    const {id} = router.query

    const {data: movieShow, error, isLoading} = useQuery<FullMovieShow, Error>(
        ['movie_show', id],
        () => fetchMovieShowById(id as string),
        {
            enabled: !!id,
        },
    )

    return (
        <PageIntranetContainer titlePage="Fiche de la séance">
            {isLoading && <PageLoading message="Chargement de la séance en cours"/>}
            {error && <PageError message={error?.message}/>}
            {movieShow && <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                {/* Details */}
                <div className="space-y-2">
                    <PropertyInline label='Film' value={movieShow.movie.title}/>
                    <div className="flex space-x-4 ">
                    <PropertyInline label='Cinema' value={movieShow.movieTheater.cinema.name}/>
                    <PropertyInline label='Salle' value={movieShow.movieTheater.theaterName}/>
                    </div>
                    <div className="flex space-x-4 ">
                    <PropertyInline label='Date' value={dayjs(movieShow.date).format('DD/MM/YYYY')}/>
                    <PropertyInline label='Début' value={`${movieShow.startTime}h`}/>
                    <PropertyInline label='Fin' value={`${movieShow.endTime}h`}/>
                    </div>
                    <PropertyInline label='Prix' value={`${movieShow.priceInEuros}€`}/>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end">
                    <ButtonEdit href={`${id}/edit`} disabled={dayjs(movieShow?.date).format('YYYY-MM-DD') <= dayjs().format('YYYY-MM-DD')} fullWidth={false}/>
                </div>
            </div>}
        </PageIntranetContainer>
    )
}

export default MoviePage;