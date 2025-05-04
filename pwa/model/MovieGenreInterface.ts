import {Movie} from "./MovieInterface";

export interface MovieGenre {
    '@id': string,
    '@type': string,
    name: string,
    tmbdId?: string,
    movies: Movie[],
    ageRestriction?: string,
    warning?: string,
}