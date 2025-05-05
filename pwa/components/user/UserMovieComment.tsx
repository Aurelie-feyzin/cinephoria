'use client';

import React, {useEffect, useState} from "react";
import EditIcon from "../common/Icon/EditIcon";
import FormReview from "./FormReview";
import {Reservation} from "../../model/ReservationInterface";


const UserMovieComment = ({reservation, refetch}: { reservation: Reservation, refetch: any }) => {
    const [viewForm, setViewForm] = useState(false);
    const [review, setReview] = useState(reservation.review);

    useEffect(() => {
        setReview(reservation.review);
    }, [reservation]);

    useEffect(() => {
        if (!viewForm) {
            refetch();
        }
    }, [refetch, viewForm]);

    return (
        !viewForm ?
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-bold whitespace-nowrap">Votre avis :</span>
                <span>{review?.comment}</span>
                <button
                    className={`group relative inline-block w-fit disabled:bg-gray-700 text-white duration-300 sm:ml-auto flex-shrink-0`}
                    disabled={!review}
                    onClick={() => setViewForm(!!review)}
                >
                    <EditIcon textColor="white"/>
                    {!review && (
                        <span
                            className="absolute hidden group-hover:flex -top-2 -right-3 translate-x-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700">
                Donner une note pour pouvoir ajouter un commentaire
            </span>
                    )}
                </button>
            </div> : review && <FormReview review={review} setViewForm={setViewForm}/>
    )
}

export default UserMovieComment;