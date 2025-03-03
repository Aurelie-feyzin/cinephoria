'use client';

import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import React, {useState} from "react";
import {SubmitHandler} from "react-hook-form";
import AlertError from "../../../../components/common/alert/AlertError";
import PageLoading from "../../../../components/common/PageLoading";
import {updateMovieShowById} from "../../../../request/movieShow";
import EmployeeForm from "../../../../components/admin/UserForm";
import {fetchEmployee, updateEmployeeById} from "../../../../request/user";
import PageAdminContainer from "../../../../components/admin/PageAdminContainer";
import {fetchForgotPassword} from "../../../../request/forgot-password";
import {EmployeeInput} from "../../../../model/User";
import {useUser} from "../../../../context/UserContext";

const EditMoviePage = () => {
    const router = useRouter();
    const {id} = router.query;
    const {refreshAccessToken} = useUser();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data: employeeData, isLoading} = useQuery(
        ['movie_show', id],
        () => fetchEmployee(id as string, refreshAccessToken),
        {
            enabled: !!id,
        }
    )

    const mutation = useMutation({
        mutationFn: (employeeData: any) => updateEmployeeById(id as string, employeeData, refreshAccessToken),
        onSuccess: () => {
            router.push('/admin/employees')
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    const onSubmit: SubmitHandler<EmployeeInput> = async (data) => {
        try {
            mutation.mutate(data);
        } catch (error) {
            setMessageKo("Erreur, employé non modifié");
        }
    }

    const resetPassword = (): Promise<boolean> =>
        fetchForgotPassword({email: employeeData?.email || ''})
            .then(() => router.push('/admin/employees'));

    return (
        <PageAdminContainer titlePage='Modifier un compte'>
            <div className="min-w-full">
                <AlertError visible={!!messageKo}
                            titleMessage="Erreur pendant le traitement"
                            message={messageKo}
                />
                {isLoading ? <PageLoading/> :
                    <EmployeeForm onSubmit={onSubmit} employeeData={employeeData}>
                        {employeeData &&
                            <button type="button"
                                    className="w-full mt-4 mb-4 bg-primary text-white p-2 rounded hover:bg-secondary"
                                    onClick={resetPassword}
                                    disabled={!employeeData}
                            >
                                Réinitialiser le mot de passe
                            </button>
                        }
                    </EmployeeForm>
                }

            </div>
        </PageAdminContainer>
    )
}

export default EditMoviePage;