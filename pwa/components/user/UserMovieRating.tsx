import React, {useEffect, useState} from "react";
import StarIcon from "../common/Icon/StarIcon";
import {useMutation} from "react-query";
import {createReview, updateReviewById} from "../../request/review";
import AlertError from "../common/alert/AlertError";


const UserMovieRating = ({reservation, refetch}: { reservation?: Reservation, refetch: any }) => {
    const [emptyStar, setEmptyStar] = useState(5);
    const [fillStar, setFillStar] = useState(5);
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
        const review = reservation?.review;
        setEmptyStar(review?.rating ? 5 - review.rating : 5);
        setFillStar(review?.rating ? review.rating : 0);
        setReview(review);
    }, [reservation]);

    const onClick = (rating: number) =>  {
        setFillStar(rating);
        setEmptyStar(5 - rating);
        mutation.mutate({rating})
    }

    return (
        <div className="flex font-bold">
            <span>Votre note: </span>
            {Array(fillStar).fill(<StarIcon color='secondary' />).map((star, index) =>
                <span key={index} onClick={() => onClick(index+1)}>{star}</span>
            )}
            {Array(emptyStar).fill(<StarIcon color='white' />).map((star, index) => (
                <span key={index} onClick={() => onClick(fillStar + index +1)} >{star}</span> // étoile vide
            ))}
            {!!messageKo && <AlertError visible={!!messageKo} message={messageKo} />}
        </div>);
}

export default UserMovieRating; //☆