import {MinimalMovie, Movie} from "./MovieInterface";
import {MovieTheater} from "./movieTheater";

export interface MovieShow {
    '@id': string;
    '@type': string,
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
}

export interface FullMovieShow {
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

export interface MovieShowInput {
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

export interface FullMovieShowApiResponse {
    'hydra:member': FullMovieShow[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}

export interface MovieShowReservation {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
    movie: Movie;
    availableSeats: number;
}

export interface MovieShowReservationApiResponse {
    'hydra:member': MovieShowReservation[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}