import React, {useState} from "react";
import {useQuery} from "react-query";
import dayjs from "dayjs";
import Table, {Column} from "../../../components/common/Table";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import ButtonAdd from "../../../components/common/button/ButtonAdd";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import {fetchMovieShows} from "../../../request/movieShow";
import Link from "next/link";
import ViewIcon from "../../../components/common/Icon/ViewIcon";
import EditIcon from "../../../components/common/Icon/EditIcon";
import Pagination from "../../../components/common/Pagination";
import {FullMovieShow, FullMovieShowApiResponse} from "../../../model/MovieShow";


const FilmShowLists = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data,
        error,
        isLoading,
    } = useQuery<FullMovieShowApiResponse, Error>(['film_show_list', currentPage], () => fetchMovieShows(currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const movieShows = data?.['hydra:member'] || [];
    const nextPageUrl = data?.['hydra:view']?.['hydra:next'];

    const columns: Column<FullMovieShow>[] = [
        {key: 'movie', label: 'Film', render: ((row: FullMovieShow) => <span>{row.movie.title}</span>)},
        {key: 'cinema', label: 'Cinéma', render: ((row: FullMovieShow) => <span>{row.movieTheater.cinema.name}</span>)},
        {
            key: 'date',
            label: 'Date',
            render: ((row: FullMovieShow) => <span>{dayjs(row.date).format('DD/MM/YYYY')}</span>)
        },
        {
            key: 'theaterName',
            label: 'Salle',
            render: ((row: FullMovieShow) => <span>{row.movieTheater.theaterName}</span>)
        },
        {key: 'startTime', label: 'Début'},
        {key: 'endTime', label: 'Fin'},
        {key: 'priceInEuros', label: 'Prix (€)'},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    <Link href={`/intranet/film_shows/${row.id}`} className="hover:bg-secondary">
                        <ViewIcon/>
                    </Link>
                    {dayjs(row.date).format('YYYY-MM-DD') <= dayjs().format('YYYY-MM-DD') ?
                        <button type="button" disabled={true}  className="disabled:bg-gray-700">
                            <EditIcon textColor="white"/>
                        </button>
                        :
                        <Link href={`/intranet/film_shows/${row.id}/edit`} className="hover:bg-secondary">
                            <EditIcon/>
                        </Link>}
                </div>
            ),
        },
    ];

    return (<PageIntranetContainer titlePage="Liste des séances"
                                   action={<ButtonAdd label="Ajouter une séance" href='/intranet/film_shows/new'/>}>
            {isLoading && <PageLoading message="Récupération des séances en cours"/>}
            {error && <PageError message={error.message}/>}
            <Table columns={columns} data={movieShows}/>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nextPageUrl={nextPageUrl} />
        </PageIntranetContainer>
    );
}
export default FilmShowLists;