import React from "react";
import {ReviewInReservation} from "../../model/Review";


const UserReviewStatus = ({review}: { review: ReviewInReservation }) => {
    if (!review?.comment) {
        return null;
    }

    return (
        <div>Statut: {review?.status.value}</div>
    )
}

export default UserReviewStatus