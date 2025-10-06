'use client';

import { useRouter } from 'next/router'
import {useQuery} from "react-query";
import {deleteMovie, fetchMovieById} from "../../../request/movie";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import EditIcon from "../../../components/common/Icon/EditIcon";
import PropertyInline from "../../../components/common/layout/PropertyInline";
import {MovieDescription} from "../../../model/MovieInterface";
import TrashIcon from "../../../components/common/Icon/TrashIcon";
import Image from "next/image";

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

    const handleDelete = async () => {
        if (!confirm('Voulez-vous vraiment supprimer ce film ?')) {
            return
        }
        try {
            await deleteMovie(id as string).then(() => router.push(`/intranet`))
        } catch (error) {
            alert("Erreur lors de la suppression du film")
        }
    }

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
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-6 py-2 flex items-center text-white bg-primary hover:bg-secondary rounded-lg shadow-md transition duration-200"
                    >
                        <Link href={`${id}/edit`} className="flex items-center space-x-2 text-white">
                            <EditIcon textColor="white" />
                            <span>Modifier</span>
                        </Link>
                    </button>
                    <button
                        onClick={() => handleDelete()}
                        className="px-6 py-2 flex items-center text-black disabled:bg-gray-400 space-x-2  bg-red-500 hover:bg-secondary rounded-lg shadow-md transition duration-200"
                        title="Supprimer"
                        disabled={!movie.deletable}
                    >
                        <TrashIcon />
                        <span>Supprimer</span>
                    </button>
                </div>
                <hr className="w-full border-t-2 mb-4 border-secondary"/>
                <div className="flex justify-center mb-4">
                    <div className="flex justify-center items-center">
                        <Image
                            src={`/poster/${movie.posterPath}`}
                            alt={`Poster de ${movie.title}`}
                            width={150}
                            height={150}
                            className="w-auto h-[450px] object-cover rounded-lg shadow-md mr-4"
                        />
                        <Image
                            src={`/backdrop/${movie.backdropPath}`}
                            alt={`Fond d'écran de ${movie.title}`}
                            width={450}
                            height={150}
                            className="w-auto h-[450px] object-cover rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>}
        </PageIntranetContainer>
    )
}

export default MoviePage;