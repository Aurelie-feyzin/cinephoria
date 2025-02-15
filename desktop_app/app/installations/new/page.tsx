'use client'
import React, {useState} from "react";
import InstallationForm from "@/app/ui/InstallationForm";
import PageContainer from "@/app/ui/PageContainer";
import AlertError from "@/app/ui/alert/AlertError";


const CreateOutOfServiceInstallation = () => {
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    return (
        <PageContainer titlePage='Signaler une installation en panne'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                <InstallationForm setMessageKo={setMessageKo} />
            </div>
        </PageContainer>
    )
}

export default CreateOutOfServiceInstallation;