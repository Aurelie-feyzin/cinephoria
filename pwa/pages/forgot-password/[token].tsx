'use client';

import InputField from "../../components/common/form/InputField";
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/router";
import {fetchResetPassword} from "../../request/forgot-password";
import AlertError from "../../components/common/alert/AlertError";
import AlertInfo from "../../components/common/alert/AlertInfo";
import PageContainer from "../../components/common/layout/PageContainer";
import InfoValidatePassword from "../../components/common/form/InfoValidatePassword";
import {REQUIRED, validatePassword} from "../../components/common/form/validator_tools";
import ButtonSubmit from "../../components/common/button/ButtonSubmit";
import {ResetPasswordInput} from "../../model/User";
import Link from "next/link";


const ResetPassword = () => {
    const router = useRouter()
    const token = router.query.token
    const [resetKo, setResetKo] = useState(false);
    const [resetOk, setResetOk] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ResetPasswordInput>();
    const onSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
        try {
            setResetKo(false);
            const response = await fetchResetPassword(data, token as string);
            if (!response.ok) {
                setResetKo(true);
                return;
            }
            setResetOk(true);
        } catch (error) {
            setResetOk(false);
            setResetKo(true);
        }
    };

    return (
        <PageContainer title='réservation'>
            <div className="max-w-md mb-4 mx-auto rounded-lg">
                <AlertError visible={resetKo}
                            titleMessage='Erreur pendant la réinitialisatoin du mot de passe'
                            message="La réinisialiation du mot de passe n'a pas pû etre effectuée"
                />
                <AlertInfo visible={resetOk}
                           titleMessage='Mot de passe réinitialisé '
                           message="La réinisialiation du mot de passe a été effectuée avec succés."
                >
                    <div className='mt-2'>
                    <Link href="/signIn?from=forgot-password"
                          className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary">
                        Se connecter
                    </Link>
                    </div>
                </AlertInfo>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-black p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-secondary">Nouveau mot de passe</h2>
                <InputField register={register("password", {...REQUIRED, validate: validatePassword})}
                            type='password'
                            name='password'
                            label='Nouveau mot de passe'
                            error={errors.password?.message}
                />
                <InfoValidatePassword/>
                <ButtonSubmit label='Réinitialiser le mot de passe' />
            </form>
        </PageContainer>
    );
}

export default ResetPassword;