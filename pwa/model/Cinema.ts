import {Address} from "./Address";
import {OpeningHours} from "./OpeningHours";

export interface Cinema {
    '@id': string;
    id: number;
    name: string;
    address: Address;
    phoneNumber: string;
    openingHours: OpeningHours[];
}

export interface MinimalCinema {
    '@id': string;
    '@type': string,
    name: string;
}