'use client'
import React, {useEffect, useState} from "react";
import InstallationForm from "@/app/ui/InstallationForm";
import PageContainer from "@/app/ui/PageContainer";
import AlertError from "@/app/ui/alert/AlertError";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchInstallation} from "@/app/api/installationApi";
import PageLoading from "@/app/ui/PageLoading";
import {useUser} from "@/app/context/UserContext";


const EditOutOfServiceInstallation = () => {
    const {id} = useParams();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);
    const { refreshAccessToken } = useUser();

    const {data, isLoading, error} = useQuery({
            queryKey: ['installation', id],
            queryFn: () => fetchInstallation(id as string, refreshAccessToken),
            enabled: !!id && typeof id === 'string',
        }
    )

    useEffect(() => {
        if (error) {
            setMessageKo(error.message);
        }
    }, [error]);

    return (
        <PageContainer titlePage='Modifier une installation en panne'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading /> :
                    <InstallationForm setMessageKo={setMessageKo} installation={data}/>
                }
            </div>
        </PageContainer>
    )

}

export default EditOutOfServiceInstallation;