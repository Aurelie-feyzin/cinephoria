
type MovieTheater = {
    '@id': string;
    '@type': string,
    cinema: MinimalCinema;
    theaterName: string;
    numberOfSeats: number;
    reducedMobilitySeats: number;
    priceInEuros: number;
    projectionQuality: FullProjectionQuality;
}

type MovieTheaterInput = {
    '@id': string;
    '@type': string,
    cinema: string;
    theaterName: string;
    numberOfSeats: number;
    reducedMobilitySeats: number;
    priceInEuros: number;
    projectionQuality: string;
}

interface MovieTheaterApiResponse {
    'hydra:member': MovieTheater[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}