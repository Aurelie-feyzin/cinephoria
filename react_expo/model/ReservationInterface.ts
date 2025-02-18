
export interface Reservation {
    '@id': string;
    '@type': string,
    id: string;
    userId: string;
    movieId: string;
    movieName: string;
    movieBackdropPath: string;
    cinemaId: string;
    cinemaName: string;
    movieShowId: string;
    movieShowDate: string;
    movieShowStartTime: string;
    movieShowEndTime: string;
    movieTheaterId: string;
    movieTheaterName: string;
    numberOfSeats: number;
    seatIds: string[];
    seatNames: string[];
}

export interface ReservationMinimal {
    '@id': string;
    '@type': string,
    movieName: string;
    cinemaName: string;
    movieShowDate: string;
    movieShowStartTime: string;
    movieShowEndTime: string;
    movieTheaterName: string;
    numberOfSeats: number;
}
