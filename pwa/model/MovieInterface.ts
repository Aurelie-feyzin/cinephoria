import {AgeRestriction} from "./AgeRestriction";
import {MovieGenre} from "./MovieGenreInterface";
import {MovieShow} from "./MovieShow";

export interface Movie {
    '@id': string,
    id: string,
    '@type': string,
    title: string,
    posterPath?: string,
    duration?: number,
    description?: string,
    genres: MovieGenre[],
    ageRestriction?: AgeRestriction,
    warning?: string,
    favorite: boolean,
    rating: number,
    movieShows: MovieShow[],
}

export interface MinimalMovie {
    '@id': string,
    id: string,
    '@type': string,
    title: string,
    duration?: number,
    description?: string,
}

export interface MovieDescription {
    '@id': string,
     id: string,
    '@type': string,
    title: string,
    posterPath?: string,
    backdropPath?: string,
    duration?: number,
    description?: string,
    genres: MovieGenre[],
    ageRestriction?: AgeRestriction,
    warning?: string,
    favorite: boolean,
    releaseDate: Date,
    rating: number,
    deletable: boolean,
}

export interface MovieTmdb {
    '@id': string,
    idTmdb: number,
    '@type': string,
    title: string,
    posterPath?: string,
    duration?: number,
    description?: string,
    genres: MovieGenre[],
    ageRestriction?: AgeRestriction,
    warning?: string,
    releaseDate: Date,
    favorite?: boolean,
}

export interface MovieDescriptionInput {
    '@id': string,
    id: string,
    '@type': string,
    title: string,
    posterPath?: string,
    duration?: number,
    description?: string,
    genres: string[],
    ageRestriction?: string,
    warning?: string,
    favorite: string,
    releaseDate: string,
    rating: number,
}

