'use client'
import PageContainer from "@/app/ui/PageContainer";
import Link from "next/link";
import {useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import PageLoading from "@/app/ui/PageLoading";
import Table, {Column} from "@/app/ui/Table";
import Pagination from "@/app/ui/Pagination";
import PageError from "@/app/ui/PageError";
import ViewIcon from "@/app/ui/Icon/ViewIcon";
import EditIcon from "@/app/ui/Icon/EditIcon";
import {fetchGetInstallationUnderMaintenance, InstallationMinimalDescription} from "@/app/api/installationApi";
import ButtonAdd from "@/app/ui/button/ButtonAdd";
import {ApiResponse} from "@/app/api/apiResponseType";


const Installations = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data,
        error,
        isLoading,
    } = useQuery<ApiResponse<InstallationMinimalDescription>, Error>({
        queryKey: ['installation_out_of_service_list', currentPage],
        queryFn: () => fetchGetInstallationUnderMaintenance(currentPage, itemsPerPage),
        placeholderData: keepPreviousData,
    });

    const installations = data?.['hydra:member'] || [];
    const nextPageUrl = data?.['hydra:view']?.['hydra:next'];

    const columns: Column<InstallationMinimalDescription>[] = [
        {
            key: 'cinema',
            label: 'Cinéma',
            render: ((row: InstallationMinimalDescription) => <span>{row.movieTheater.cinema.name}</span>)
        },
        {
            key: 'theaterName',
            label: 'Salle',
            render: ((row: InstallationMinimalDescription) => <span>{row.movieTheater.theaterName}</span>)
        },
        {key: 'name', label: 'Nom de l\'installation'},
        {key: 'status', label: 'Status', render: (row) => row.status?.value},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    <Link href={`/installations/show?id=${row.id}`} className="hover:bg-secondary">
                        <ViewIcon/>
                    </Link>
                    <Link href={`/installations/edit?id=${row.id}`} className="hover:bg-secondary">
                        <EditIcon/>
                    </Link>
                </div>
            ),
        },
    ];


    return (
        <PageContainer titlePage="Installation en panne"
                       action={
                           <ButtonAdd label="Signaler un équipement en panne" href={'/installations/new'}/>
                       }
        >
            {isLoading && <PageLoading message="Récupération des installations non disponible en cours"/>}
            {error && <PageError message={error.message}/>}
            <Table columns={columns} data={installations} />
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nextPageUrl={nextPageUrl}/>

        </PageContainer>
    );
}

export default Installations;
