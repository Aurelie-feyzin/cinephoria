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
import {fetchMovieTheaterById} from "../../../request/movieTheater";
import {MovieTheater} from "../../../model/movieTheater";

const MovieTheaterPage = () => {
    const router = useRouter()
    const {id} = router.query

    const {data: movieTheater, error, isLoading} = useQuery<MovieTheater, Error>(
        ['movie_theater', id],
        () => fetchMovieTheaterById(id as string),
        {
            enabled: !!id,
        },
    )

    return (
        <PageIntranetContainer titlePage="Fiche d'une salle">
            {isLoading && <PageLoading message="Chargement de la salle en cours"/>}
            {error && <PageError message={error?.message}/>}
            {movieTheater && <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                {/* Details */}
                <div className="space-y-2">
                    <PropertyInline label='Cinema' value={movieTheater.cinema.name}/>
                    <PropertyInline label='Nom de la salle' value={movieTheater.theaterName}/>
                    <PropertyInline label='Qualité de projection' value={movieTheater.projectionQuality.name}/>
                    <div className="flex space-x-4 ">
                    <PropertyInline label='Nombre de sieges' value={`${movieTheater.numberOfSeats}`}/>
                    <PropertyInline label='dont mobilité réduites' value={`${movieTheater.reducedMobilitySeats}`}/>
                    </div>
                    <PropertyInline label='Prix conseillé' value={`${(movieTheater.projectionQuality.suggestedPrice)/100}€`}/>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end">
                    <ButtonEdit href={`${id}/edit`}  fullWidth={false}/>
                </div>
            </div>}
        </PageIntranetContainer>
    )
}

export default MovieTheaterPage;