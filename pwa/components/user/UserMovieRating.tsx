'use client';

import React, {useEffect, useState} from "react";
import StarIcon from "../common/Icon/StarIcon";
import {useMutation} from "react-query";
import {createReview, updateReviewById} from "../../request/review";
import AlertError from "../common/alert/AlertError";
import {Reservation} from "../../model/ReservationInterface";


const UserMovieRating = ({reservation, refetch}: { reservation?: Reservation, refetch: any }) => {
    const [fillStar, setFillStar] = useState(0);
    const [review, setReview] = useState(reservation?.review);
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const mutation = useMutation({
        mutationFn: (reviewData: any) => review ? updateReviewById(review['@id'] as string, reviewData)
            : createReview({
                ...reviewData,
                reservation: reservation?.['@id'],
            }),
        onSuccess: () => {
            refetch()
        },
        onError: () => {
            setMessageKo('La note n\'a pas été mise à jours');
        },
    })

    useEffect(() => {
        const rating = reservation?.review?.rating ?? 0;
        setFillStar(rating);
        setReview(reservation?.review);
    }, [reservation]);

    const onClick = (rating: number) =>  {
        setFillStar(rating);
        mutation.mutate({rating})
    }

    return (
        <div className="flex font-bold">
            <span>Votre note: </span>
            {[...Array(fillStar)].map((_, index) => (
                <span key={`fill-${index}`} onClick={() => onClick(index + 1)}>
                    <StarIcon color="secondary" />
                </span>
            ))}
            {[...Array(5-fillStar)].map((_, index) => (
                <span key={`empty-${index}`} onClick={() => onClick(fillStar + index + 1)}>
                    <StarIcon color="white" />
                 </span>
            ))}
            {!!messageKo && <AlertError visible={!!messageKo} message={messageKo} />}
        </div>);
}

export default UserMovieRating;