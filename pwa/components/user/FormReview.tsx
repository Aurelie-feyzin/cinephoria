'use client';

import {SubmitHandler, useForm} from "react-hook-form";
import TextAreaField from "../common/form/TextAreaField";
import ButtonSubmit from "../common/button/ButtonSubmit";
import React, {useState} from "react";
import {createReview, updateReviewById} from "../../request/review";
import {useMutation, useQuery} from "react-query";
import {fetchEnums, URL_ENUM} from "../../request/api";
import AlertError from "../common/alert/AlertError";
import {ReviewInput, ReviewInReservation} from "../../model/Review";


const FormReview = ({review, setViewForm}:{review: ReviewInReservation, setViewForm:any}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ReviewInput>({
        defaultValues: review ? review : {}
    });
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const {data: statuses, error: errorStatus, isLoading: isLoadingStatus} = useQuery(
        ['review_statuses'], () => fetchEnums(URL_ENUM.review_status),
    )

    const mutation = useMutation({
        mutationFn: (reviewData: any) => updateReviewById(review['@id'] as string, reviewData),
        onSuccess: () => {
            setViewForm(false);
        },
        onError: () => {
            setMessageKo("Le commentaire n'a pas été modifié");
        },
    })

    const onSubmit: SubmitHandler<ReviewInput> = async (data) => {
        try {
            mutation.mutate({
                ...data,
                status: statuses?.find((status) => status['@id'].includes('SUBMITTED'))?.['@id']
            })
        } catch (error) {
           setMessageKo("Le commentaire n'a pas été modifié");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className="max-w-full mx-auto rounded-lg shadow-md">
            {!!messageKo && <AlertError visible={!!messageKo} message={messageKo} />}
            <TextAreaField
                register={register("comment")}
                name='comment'
                label='Votre avis'
                placeholder="Ecrivez ici votre avis sur le film"
                error={errors.comment?.message}
            />
            <ButtonSubmit />
        </form>
    )
}

export default FormReview;