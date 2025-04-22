'use client'
import React from "react";
import PageContainer from "@/app/ui/PageContainer";
import AlertError from "@/app/ui/alert/AlertError";
import {useQuery} from "@tanstack/react-query";
import {fetchInstallation} from "@/app/api/installationApi";
import {useParams} from "next/navigation";
import PropertyInline from "@/app/ui/PropertyInline";
import PageLoading from "@/app/ui/PageLoading";
import ButtonEdit from "@/app/ui/button/ButtonEdit";
import {useUser} from "@/app/context/UserContext";


const CreateOutOfServiceInstallation = () => {
    const {id} = useParams();
    const { refreshAccessToken } = useUser();


    const {data, isLoading, error} = useQuery({
            queryKey: ['installation', id],
            queryFn: () => fetchInstallation(id as string, refreshAccessToken),
            enabled: !!id && typeof id === 'string',
        }
    )

    return (
        <PageContainer titlePage='Installation'>
            <div className="min-w-full">
                <AlertError visible={!!error}
                            titleMessage="Erreur pendant le traitement"
                            message={error?.message}
                />
                {isLoading ? <PageLoading/> :
                    <div className="space-y-2">
                        <div className="flex space-x-4 ">
                            <PropertyInline label='Cinema' value={data?.movieTheater.cinema.name}/>
                            <PropertyInline label='Nom de la salle' value={data?.movieTheater.theaterName}/>
                        </div>
                        <hr/>
                        <div className="flex space-x-4 ">
                            <PropertyInline label='Status' value={data?.status.value}/>
                            <PropertyInline label='Date dernière maintenance'
                                            value={data?.lastMaintenanceDate ? new Date(data.lastMaintenanceDate).toLocaleDateString() : ' - '}/>
                            <PropertyInline label='Date dernière réparation'
                                            value={data?.lastRepairDate ? new Date(data.lastRepairDate).toLocaleDateString() : ' - '}/>
                        </div>
                        <PropertyInline label='Description du problème' value={data?.repairDetails}/>
                        <hr />
                        <div className="flex justify-end">
                            <ButtonEdit href={`/installations/${id}/edit`} fullWidth={false}/>
                        </div>
                    </div>
                }
            </div>
        </PageContainer>
    )

}

export default CreateOutOfServiceInstallation;