'use client';

import {useRouter} from "next/router";
import React, {useState} from "react";
import AlertError from "../../../components/common/alert/AlertError";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation} from "react-query";
import EmployeeForm from "../../../components/admin/UserForm";
import {fetchForgotPassword} from "../../../request/forgot-password";
import {createEmployee} from "../../../request/user";
import {SubmitHandler} from "react-hook-form";
import {EmployeeInput} from "../../../model/User";
import {useUser} from "../../../context/UserContext";

function genPassword() {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 12;
    let password = "P@s1";
    for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

const CreateMovie = () => {
    const {refreshAccessToken} = useUser();
    const router = useRouter();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const mutation = useMutation({
        mutationFn: (employeeData: any) => createEmployee(employeeData, refreshAccessToken),
        onSuccess: (response) => {
            if (response) {
                if (response.email) {
                    fetchForgotPassword({email: response.email}).then(() => router.push('/admin/employees'));
                }
            }
        },
        onError: () => {
            setMessageKo('Erreur lors de la création de l\'employé');
        },
    })

    const onSubmit: SubmitHandler<EmployeeInput> = async (data) => {
        try {
            data = {
                ...data,
                // Set a generic password for the user, which will be automatically reset later
                plainPassword: genPassword(),
                roles: ['ROLE_EMPLOYEE'],
            }
            mutation.mutate(data);
        } catch (error) {
            setMessageKo("Erreur, employé non modifié");
        }
    }

    return (
        <PageIntranetContainer titlePage='Ajouter un employé'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                <EmployeeForm onSubmit={onSubmit}/>
            </div>
        </PageIntranetContainer>
    )

}

export default CreateMovie;