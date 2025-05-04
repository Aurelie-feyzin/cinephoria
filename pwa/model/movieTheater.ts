import {MinimalCinema} from "./Cinema";
import {FullProjectionQuality} from "./ProjectionQuality";

export type MovieTheater = {
    '@id': string;
    '@type': string,
    id: string;
    cinema: MinimalCinema;
    theaterName: string;
    numberOfSeats: number;
    reducedMobilitySeats: number;
    priceInEuros: number;
    projectionQuality: FullProjectionQuality;
}

export type MovieTheaterInput = {
    '@id': string;
    '@type': string,
    cinema: string;
    theaterName: string;
    numberOfSeats: number;
    reducedMobilitySeats: number;
    priceInEuros: number;
    projectionQuality: string;
}