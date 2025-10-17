'use client';

import PageContainer from "../components/common/layout/PageContainer";
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../components/common/form/InputField";
import TextAreaField from "../components/common/form/TextAreaField";
import AlertError from "../components/common/alert/AlertError";
import {useUser} from "../context/UserContext";
import {newContact} from "../request/contact";
import AlertInfo from "../components/common/alert/AlertInfo";
import ButtonSubmit from "../components/common/button/ButtonSubmit";
import {customMaxLength, REQUIRED} from "../components/common/form/validator_tools";
import {ContactInput} from "../model/Contact";

const Contact = () => {
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);
    const [messageoK, setMessageOk] = useState<boolean>(false);
    const {user} = useUser();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ContactInput>({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            title: undefined,
            description: undefined,
        }
    });

    const onSubmit: SubmitHandler<ContactInput> = async (data) => {
        try {
            setMessageKo(undefined);
            const response = await newContact(data);
            if (!response.ok) {
                const badReponse = await response.json();
                setMessageKo(badReponse.message);
                return;
            }
            setMessageOk(true);
        } catch (error) {
            setMessageKo("Erreur pendant l'envoi de l'émail");
        }
    };

    return (<PageContainer
            title='contact'
            titlePage="Contactez-nous"
            metaDescription="Contactez Cinephoria pour toute question, réservation ou information sur nos cinémas et séances."
        >
            <div className="container mx-auto p-6">
                <div className="mb-4">
                    <AlertError visible={!!messageKo}
                                titleMessage="Erreur pendant le traitement"
                                message={messageKo}
                    />
                    <AlertInfo visible={messageoK}
                               titleMessage="Merci pour votre message."
                               message="Nous avons bien reçu votre message, une copie vous a été envoyé."
                    />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
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
                    <InputField register={register("title", {...REQUIRED, ...customMaxLength(180)})}
                                name='title'
                                label='Titre de la demande'
                                error={errors.title?.message}
                    />
                    <TextAreaField
                        register={register("description", {...REQUIRED})}
                        name='description'
                        label='Votre message'
                        error={errors.description?.message}
                    />
                    <ButtonSubmit />
                </form>
            </div>
        </PageContainer>
    );
}

export default Contact;