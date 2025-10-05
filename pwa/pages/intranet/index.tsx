'use client';

import PageIntranetContainer from "../../components/intranet/PageIntranetContainer";
import {useQuery} from "react-query";
import {deleteMovie, fetchMoviesDescription} from "../../request/movie";
import PageLoading from "../../components/common/PageLoading";
import PageError from "../../components/common/PageError";
import React, {useState} from "react";
import Link from "next/link";
import EditIcon from "../../components/common/Icon/EditIcon";
import ViewIcon from "../../components/common/Icon/ViewIcon";
import ButtonAdd from "../../components/common/button/ButtonAdd";
import Table, {Column} from "../../components/common/Table";
import dayjs from "dayjs";
import Pagination from "../../components/common/Pagination";
import {ApiResponse} from "../../model/ApiResponseType";
import {MovieDescription} from "../../model/MovieInterface";
import TrashIcon from "../../components/common/Icon/TrashIcon";


const MovieList = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data: moviesData,
        error,
        isLoading,
        refetch
    } = useQuery<ApiResponse<MovieDescription>, Error>(['movies_description', currentPage], () => fetchMoviesDescription(currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const movies = moviesData?.['hydra:member'] || [];
    const nextPageUrl = moviesData?.['hydra:view']?.['hydra:next'];


    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer ce film ?')) {
            return
        }
        try {
            await deleteMovie(id)
            refetch();
        } catch (error) {
            alert("Erreur lors de la suppression du film")
        }
    }

    const columns: Column<MovieDescription>[] = [
        {key: 'title', label: 'Titre'},
        {
            key: 'releaseDate',
            label: 'Date de sortie',
            render: ((row: MovieDescription) => <span>{dayjs(row.releaseDate).format('DD/MM/YYYY')}</span>)
        },
        {key: 'duration', label: 'Durée (min)'},
        {
            key: 'description',
            label: 'Synopsis',
            render: (row: any) => (
                <div className="relative group max-w-xs">
                    <span className="block truncate">{row.description}</span>
                    <div
                        className="absolute hidden group-hover:block bg-white border border-gray-300 p-4 shadow-md text-sm max-w-lg z-10">
                        {row.description}
                    </div>
                </div>
            ),
        },
        {
            key: 'genres',
            label: 'Genres',
            render: (row) => row.genres.map((genre) => genre.name).join(', '),
        },
        {key: 'ageRestriction', label: 'Age', render: (row) => row.ageRestriction?.value},
        {key: 'warning', label: 'Warning', render: (row) => (row.warning ? 'Avec avertissement' : 'Sans')},
        {key: 'favorite', label: 'Coups de coeur', render: (row) => (row.favorite ? 'Oui' : 'Non')},
        {key: 'rating', label: 'Note'},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    <Link href={`/intranet/movies/${row.id}`} className="hover:bg-secondary">
                        <ViewIcon/>
                    </Link>
                    <Link href={`/intranet/movies/${row.id}/edit`} className="hover:bg-secondary">
                        <EditIcon/>
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="hover:bg-secondary disabled:bg-gray-500"
                        title={row.deletable ? 'Supprimer' : 'Pas supprimable'}
                        disabled={!row.deletable}
                    >
                        <TrashIcon />
                    </button>
                </div>
            ),
        },
    ];

    return <PageIntranetContainer titlePage="Liste des films"
                                  action={<ButtonAdd label="Ajouter un film" href='intranet/movies/new'/>}>
        {isLoading && <PageLoading message="Récupération des films en cours"/>}
        {error && <PageError message={error.message}/>}
        <Table columns={columns} data={movies}/>
        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} nextPageUrl={nextPageUrl}/>
    </PageIntranetContainer>
}

export default MovieList;