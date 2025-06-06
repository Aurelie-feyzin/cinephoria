'use client';

import React, {useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../common/form/InputField";
import {createUser} from "../../request/user";
import LinkLoginForm from "./LinkLoginForm";
import AlertInfo from "../common/alert/AlertInfo";
import AlertError from "../common/alert/AlertError";
import LinkForgotPasswordForm from "./LinkForgotPasswordForm";
import {customMaxLength, REQUIRED, validatePassword} from "../common/form/validator_tools";
import InfoValidatePassword from "../common/form/InfoValidatePassword";
import ButtonSubmit from "../common/button/ButtonSubmit";
import {useMutation} from "react-query";
import {LOGIN_FORM} from "../../pages/signIn";
import {UserInput} from "../../model/User";

const RegistrationForm = ({setFormVisible}: { setFormVisible: any }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserInput>();
    const [registationOk, setRegistrationOk] = useState(false);
    const [registationKo, setRegistrationKo] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: any) => createUser(data),
        onSuccess: (response) => {
            setRegistrationOk(true);
            setRegistrationKo(false);
        },
        onError: () => {
            setRegistrationOk(false);
            setRegistrationKo(true);
        },
    })

    const onSubmit: SubmitHandler<UserInput> = async (data) => {
        try {
            mutation.mutate(data);
        } catch (error) {
            setRegistrationKo(true);
            setRegistrationOk(false);
        }
    };

    return (
        <>
            <div className="max-w-md mb-4 mx-auto rounded-lg">
                <AlertInfo visible={registationOk}
                           titleMessage='Compte crée avec succés'
                           message="Votre compte a bien été crée, vous allez recevoir un émail de confirmation d'inscription.
                           Vous pouvez vous connecter dès maintenant."
                >
                    <button type="button"
                            className="text-center item-center bg-primary text-white p-2 rounded hover:bg-secondary flex"
                            onClick={() => setFormVisible(LOGIN_FORM)}>
                        Connectez-vous
                    </button>
                </AlertInfo>
                <AlertError visible={registationKo}
                            titleMessage='Erreur pendant la création du compte'
                            message="Une erreur c'est produite pendant la création du compte."
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-black p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-secondary">Créer un compte</h2>
                <InputField register={register("firstName", {...REQUIRED, ...customMaxLength(255)})}
                            name='firstName'
                            label='Prénom'
                            error={errors.firstName?.message}
                />
                <InputField register={register("lastName", {...REQUIRED, ...customMaxLength(255)})}
                            name='lastName'
                            label='Nom'
                            error={errors.lastName?.message}
                />
                <InputField register={register("email", {...REQUIRED, ...customMaxLength(180)})}
                            type='email'
                            name='email'
                            label='Email'
                            error={errors.email?.message}
                />
                <InputField register={register("plainPassword", {...REQUIRED, validate: validatePassword})}
                            type='password'
                            name='plainPassword'
                            label='Mot de passe'
                            error={errors.plainPassword?.message}
                />
                <InfoValidatePassword/>
                <LinkLoginForm setFormVisible={setFormVisible}/>
                <LinkForgotPasswordForm setFormVisible={setFormVisible}/>
                <ButtonSubmit/>
            </form>
        </>
    );
};

export default RegistrationForm;