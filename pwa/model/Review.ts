interface ReviewInReservation {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    approved: string,
    updatedAt: Date,
}

interface Review {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    approved: string,
    updatedAt: Date,
    reservation: ReservationInReview,
}

interface ReviewInput {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    reservation: string
}