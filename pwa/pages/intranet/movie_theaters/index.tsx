import React, {useState} from "react";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import Link from "next/link";
import {useQuery} from "react-query";
import Table, {Column} from "../../../components/common/Table";
import ViewIcon from "../../../components/common/Icon/ViewIcon";
import EditIcon from "../../../components/common/Icon/EditIcon";
import ButtonAdd from "../../../components/common/button/ButtonAdd";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import {fetchMovieTheaters} from "../../../request/movieTheater";
import Pagination from "../../../components/common/Pagination";


const MovieTheaterList = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data: movieTheaterData,
        error,
        isLoading,
    } = useQuery<MovieTheaterApiResponse, Error>(['movies_theaters', currentPage], () => fetchMovieTheaters(currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const movieTheaters = movieTheaterData?.['hydra:member'] || [];
    const nextPageUrl = movieTheaterData?.['hydra:view']?.['hydra:next'];

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    console.log(movieTheaters);

    const columns: Column<MovieTheater>[] = [
        {key: 'cinema', label: 'Cinéma', render: ((row: MovieTheater) => <span>{row.cinema.name}</span>)},
        {key: 'theaterName', label: 'Nom de la salle'},
        {key: 'projectionQuality', label: 'Qualité de projection', render: ((row: MovieTheater) => <span>{row.projectionQuality.name}</span>)},
        {key: 'numberOfSeats', label: 'Nombre de sièges'},
        {key: 'reducedMobilitySeats', label: 'dont mobilité réduites'},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    <Link href={`/intranet${row['@id']}`} className="hover:bg-secondary">
                        <ViewIcon/>
                    </Link>
                    <Link href={`/intranet${row['@id']}/edit`} className="hover:bg-secondary">
                        <EditIcon/>
                    </Link>
                </div>
            ),
        },
    ];

    return <PageIntranetContainer titlePage="Liste des salles"
                                  action={<ButtonAdd label="Ajouter une salle" href='/intranet/movie_theaters/new'/>}>
        {isLoading && <PageLoading message="Récupération des salles en cours"/>}
        {error && <PageError message={error.message}/>}
        <Table columns={columns} data={movieTheaters} index={'@id'}/>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nextPageUrl={nextPageUrl} />
    </PageIntranetContainer>
}

export default MovieTheaterList;