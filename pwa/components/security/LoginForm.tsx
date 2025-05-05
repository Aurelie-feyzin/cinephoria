'use client'

import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../common/form/InputField";
import AlertError from "../common/alert/AlertError";
import {useUser} from "../../context/UserContext";
import {fetchGetToken} from "../../request/auth";
import LinkForgotPasswordForm from "./LinkForgotPasswordForm";
import LinkRegisterForm from "./LinkRegisterForm";
import {customMaxLength, REQUIRED} from "../common/form/validator_tools";
import ButtonSubmit from "../common/button/ButtonSubmit";
import {LoginInput} from "../../model/User";

const LoginForm = ({setFormVisible }: { setFormVisible: any }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginInput>();
    const [loginKo, setLoginKo] = useState(false);
    const [messageKo, setMessageKo] = useState('');
    const {login} = useUser();


    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        try {
            setMessageKo('');
            setLoginKo(false);
            const response = await fetchGetToken(data);
            if (!response.ok) {
                const badResponse = await response.json();
                if (badResponse.code === 401 && badResponse.message === 'Invalid credentials.') {
                   setMessageKo('Identification impossible : émail et/ou mot de passe incorrect.');
                } else {
                    setMessageKo('Une erreur c\'est produite pendant la récupération de votre profil.)');
                }
                setLoginKo(true);
                return;
            }
            const tokenResponse = await response.json();
            login(tokenResponse.token);
        } catch (error) {
            setLoginKo(true);
        }
    };

    return (
        <>
            <div className="max-w-md mb-4 mx-auto rounded-lg">
                <AlertError visible={loginKo}
                            titleMessage='Erreur pendant la récupération du profil'
                            message={messageKo}
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-black p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-secondary">Se connecter</h2>
                <InputField register={register("username", {...REQUIRED, ...customMaxLength(180)})}
                            type='email'
                            name='username'
                            label='Email'
                            error={errors.username?.message}
                />
                <InputField register={register("password", {...REQUIRED})}
                            type='password'
                            name='password'
                            label='Mot de passe'
                            error={errors.password?.message}
                />
                <LinkRegisterForm setFormVisible={setFormVisible} />
                <LinkForgotPasswordForm setFormVisible={setFormVisible} />
                <ButtonSubmit label="Se connecter" />
            </form>
        </>
    );
}

export default LoginForm;