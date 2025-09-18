'use client'
import React, {Suspense, useEffect, useState} from "react";
import InstallationForm from "@/app/ui/InstallationForm";
import PageContainer from "@/app/ui/PageContainer";
import AlertError from "@/app/ui/alert/AlertError";
import {useQuery} from "@tanstack/react-query";
import {fetchInstallation} from "@/app/api/installationApi";
import PageLoading from "@/app/ui/PageLoading";
import {useSearchParams} from "next/navigation";


const EditOutOfServiceInstallation = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data, isLoading, error} = useQuery({
            queryKey: ['installation', id],
            queryFn: () => fetchInstallation(id as string),
            enabled: !!id,
        }
    )

    useEffect(() => {
        if (error) {
            setMessageKo(error.message);
        }
    }, [error]);

    return (
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading /> :
                    <InstallationForm setMessageKo={setMessageKo} installation={data}/>
                }
            </div>
    )

}

const EditPage = () => (
    <PageContainer titlePage='Modifier une installation en panne'>
        <Suspense fallback={<PageLoading/>}>
            <EditOutOfServiceInstallation />
        </Suspense>
    </PageContainer>

);

export default EditPage;