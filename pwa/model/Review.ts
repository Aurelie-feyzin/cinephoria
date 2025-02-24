interface ReviewInReservation {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    status: Enum,
    updatedAt: Date,
}

interface Review {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    status: Enum,
    updatedAt: Date,
    reservation: ReservationInReview,
}

interface ReviewInput {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
}