

interface Reservation {
    '@id': string;
    '@type': string,
    id: string;
    userId: string;
    movieId: string;
    movieName: string;
    cinemaId: string;
    cinemaName: string;
    movieShowId: string;
    movieShowDate: string;
    movieBackdropPath?: string;
    movieShowStartTime: string;
    movieShowEndTime: string;
    movieTheaterId: string;
    movieTheaterName: string;
    numberOfSeats: number;
    seatIds: string[];
    seatNames: string[];
    review?: ReviewInReservation
}

interface ReservationInReview {
    '@id': string;
    '@type': string,
    id: string;
    movieName: string;
}
