import React from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {customMaxLength, REQUIRED} from "../form/utils";
import InputField from "../common/form/InputField";
import {createUser} from "../../request/user";

const validatePassword = (password: string) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!uppercaseRegex.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre majuscule.";
    }
    if (!lowercaseRegex.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre minuscule.";
    }
    if (!numberRegex.test(password)) {
        return "Le mot de passe doit contenir au moins un chiffre.";
    }
    if (!specialCharRegex.test(password)) {
        return "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    return true;
};

const RegistrationForm = ({setRegistrationOk, setRegistrationKo, setRegistrationForm}: {
    setRegistrationOk: any,
    setRegistrationKo: any,
    setRegistrationForm: any,
}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserInput>();

    const onSubmit: SubmitHandler<UserInput> = async (data) => {
        try {
            const response = await createUser(data);
            if (!response.ok) {
                setRegistrationOk(false);
                setRegistrationKo(true);
                return;
            }
            setRegistrationOk(true);
            setRegistrationKo(false);
            setRegistrationForm(false);
        } catch (error) {
            setRegistrationKo(true);
            setRegistrationOk(false);
        }
    };

    return (
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
            <div className="mb-4 ">
                <ul className="mt-2 text-sm text-gray-700">
                    <li className="flex items-center">
                        <span className="mr-2">•</span> Minimum 8 caractères
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span> Au moins 1 lettre majuscule
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span> Au moins 1 lettre minuscule
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span> Au moins 1 nombre
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span> Au moins 1 caractère spécial
                    </li>
                </ul>
            </div>
            <p className="mb-4 text-center text-secondary">
                Déjà un compte :&nbsp;
                <a onClick={() => setRegistrationForm(false)}>connectez-vous</a>
            </p>
            <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600">
                Enregistrer
            </button>
        </form>
    );
};

export default RegistrationForm;