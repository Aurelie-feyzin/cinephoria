'use client';

import PageAdminContainer from "../../../components/admin/PageAdminContainer";
import ButtonAdd from "../../../components/common/button/ButtonAdd";
import PageLoading from "../../../components/common/PageLoading";
import PageError from "../../../components/common/PageError";
import Pagination from "../../../components/common/Pagination";
import {useState} from "react";
import {fetchEmployees} from "../../../request/user";
import {useQuery} from "react-query";
import Table, { Column } from "../../../components/common/Table";
import Link from "next/link";
import EditIcon from "../../../components/common/Icon/EditIcon";
import {orderBy} from "lodash";
import {Employee} from "../../../model/User";

const EmployeeList = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data: employeesApi,
        error,
        isLoading,
    } = useQuery<any, Error>(['employees', currentPage], () => fetchEmployees(currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const employee = orderBy((employeesApi?.['hydra:member']), 'lastName') || [];
    const nextPageUrl = employeesApi?.['hydra:view']?.['hydra:next'];

    const columns: Column<Employee>[] = [
        {key: 'firstName', label: 'Prénom'},
            {key: 'lastName', label: 'Nom'},
            {key: 'email', label: 'Email'},
        {
            key: 'roles',
            label: 'Droit dans l\'app',
            render: ((row: any) => <span>{(row.roles.filter((role: string) => role !== 'ROLE_USER').join(','))}</span>)
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    <Link href={`/admin/employees/${row.id}/edit`} className="hover:bg-secondary">
                        <EditIcon/>
                    </Link>
                </div>
            ),
        },
    ];

    return <PageAdminContainer titlePage="Liste des employés"
                                  action={<ButtonAdd label="Ajouter un employé" href='/admin/employees/new'/>}>
        {isLoading && <PageLoading message="Récupération des films en cours"/>}
        {error && <PageError message={error.message}/>}
        <Table columns={columns} data={employee}/>
        <Pagination nextPageUrl={nextPageUrl} currentPage={currentPage} setCurrentPage={setCurrentPage} />

    </PageAdminContainer>
}

export default EmployeeList;