import {Enum} from "./ApiResponseType";
import {ReservationInReview} from "./ReservationInterface";

export interface ReviewInReservation {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    status: Enum,
    updatedAt: Date,
}

export interface Review {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
    rating: number,
    status: Enum,
    updatedAt: Date,
    reservation: ReservationInReview,
}

export interface ReviewInput {
    '@id': string;
    '@type': string,
    id: string;
    comment: string,
}