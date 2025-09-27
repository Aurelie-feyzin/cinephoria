'use client'
import React, {Suspense} from "react";
import PageContainer from "@/app/ui/PageContainer";
import AlertError from "@/app/ui/alert/AlertError";
import {useQuery} from "@tanstack/react-query";
import {fetchInstallation} from "@/app/api/installationApi";
import {useSearchParams} from "next/navigation";
import PropertyInline from "@/app/ui/PropertyInline";
import PageLoading from "@/app/ui/PageLoading";
import ButtonEdit from "@/app/ui/button/ButtonEdit";


const CreateOutOfServiceInstallation = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const {data, isLoading, error} = useQuery({
            queryKey: ['installation', id],
            queryFn: () => fetchInstallation(id as string),
            enabled: !!id,
        }
    )

    return (
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
                            <ButtonEdit href={`/installations/edit?id=${id}`} fullWidth={false}/>
                        </div>
                    </div>
                }
            </div>
    )

}

const Page = () => (
    <PageContainer titlePage='Installation'>
        <Suspense fallback={<PageLoading/>}>
            <CreateOutOfServiceInstallation />
        </Suspense>
    </PageContainer>

);

export default Page;