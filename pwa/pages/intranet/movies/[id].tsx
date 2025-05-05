'use client';

import { useRouter } from 'next/router'
import {useQuery} from "react-query";
import {fetchMovieById} from "../../../request/movie";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import EditIcon from "../../../components/common/Icon/EditIcon";
import ButtonEdit from "../../../components/common/button/ButtonEdit";
import PropertyInline from "../../../components/common/layout/PropertyInline";
import {MovieDescription} from "../../../model/MovieInterface";

const MoviePage = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: movie, error, isLoading } = useQuery<MovieDescription, Error>(
        ['movie', id],
        () => fetchMovieById(id as string),
        {
            enabled: !!id,
        },
    )

    return (
        <PageIntranetContainer titlePage={`Fiche du film : ${movie?.title}`} >
            {isLoading && <PageLoading message="Chargement du film en cours" /> }
            {error && <PageError message={error?.message} /> }
            { movie && <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                {/* Movie Details */}
                <div className="space-y-2">
                    <PropertyInline label='Titre' value={movie.title} />
                    <PropertyInline label='Date de sortie' value={dayjs(movie.releaseDate).format('DD/MM/YYYY')} />
                    <PropertyInline label='Durée' value={`${movie.duration} min`} />
                    <PropertyInline label='Description' value={movie.description} />
                    <PropertyInline label='Genres' value={movie.genres.map((genre) => genre.name).join(', ')} />
                    <PropertyInline label='Public' value={movie.ageRestriction?.value} />
                    <PropertyInline label='Avertissement' value={movie?.warning ? 'Avec avertissement' : 'Sans avertissement'} />
                    <PropertyInline label='Coup de coeur' value={movie.favorite ? 'Oui' : 'Non'} />
                </div>

                {/* Edit Button */}
                <div className="flex justify-end">
                    <button
                        className="px-6 py-2 flex items-center text-white bg-primary hover:bg-secondary rounded-lg shadow-md transition duration-200"
                    >
                        <Link href={`${id}/edit`} className="flex items-center space-x-2 text-white">
                            <EditIcon textColor="white" />
                            <span>Modifier</span>
                        </Link>
                    </button>
                </div>
            </div>}
        </PageIntranetContainer>
    )
}

export default MoviePage;