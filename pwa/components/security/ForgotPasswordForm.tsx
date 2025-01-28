import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../common/form/InputField";
import AlertError from "../common/alert/AlertError";
import {fetchForgotPassword} from "../../request/forgot-password";
import LinkRegisterForm from "./LinkRegisterForm";
import AlertInfo from "../common/alert/AlertInfo";
import LinkLoginForm from "./LinkLoginForm";
import {customMaxLength, REQUIRED} from "../common/form/validator_tools";

const ForgotPasswordForm = ({setFormVisible }: { setFormVisible: any }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ForgotPasswordInput>();
    const [actionKo, setActionKo] = useState(false);
    const [actionOk, setActionOk] = useState(false);


    const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
        try {
            setActionKo(false);
            const response = await fetchForgotPassword(data);
            if (!response.ok) {
                setActionKo(true);
               return;
            }
           setActionOk(true);
        } catch (error) {
            setActionOk(true);
        }
    };

    return (
        <>
            <div className="max-w-md mb-4 mx-auto rounded-lg">
                <AlertError visible={actionKo}
                            titleMessage='Erreur pendant la réinitialisation.'
                            message="La réinitialisation du mot de passe n'a pas pû être effectuée"
                />
                <AlertInfo visible={actionOk}
                            titleMessage='Réinitialisation en cours.'
                            message="Vous avez recevoir un émail pour finaliser la réinitialisation de votre mot de passe."
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-black p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-secondary">Mot de passe oublié</h2>
                <InputField register={register("email", {...REQUIRED, ...customMaxLength(180)})}
                            type='email'
                            name='email'
                            label='Email'
                            error={errors.email?.message}
                />
                <LinkRegisterForm setFormVisible={setFormVisible} />
                <LinkLoginForm setFormVisible={setFormVisible} />
                <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600">
                    Réinitialiser le mot de passe
                </button>
            </form>
        </>
    );
}

export default ForgotPasswordForm;