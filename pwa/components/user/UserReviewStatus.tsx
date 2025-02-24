import React from "react";


const UserReviewStatus = ({review}: { review: ReviewInReservation }) => {
    if (!review?.comment) {
        return null;
    }

    return (
        <div>Statut: {review?.status.value}</div>
    )
}

export default UserReviewStatus