
interface MovieShow {
    '@id': string;
    '@type': string,
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
}

interface FullMovieShow {
    '@id': string;
    '@type': string,
    'id': string;
    movie: MinimalMovie,
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
}

interface MovieShowInput {
    '@id': string;
    '@type': string,
    'id': string;
    movie: string,
    date: string;
    startTime: string;
    endTime: string;
    priceInCents: number;
    movieTheater: string;
    cinema:string
}

interface FullMovieShowApiResponse {
    'hydra:member': MovieShowReservation[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}

interface MovieShowReservation {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
    movie: Movie;
    availableSeats: number;
}