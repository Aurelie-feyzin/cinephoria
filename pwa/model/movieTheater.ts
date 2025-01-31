
type MovieTheater = {
    '@id': string;
    '@type': string,
    cinema: MinimalCinema;
    theaterName: string;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    projectionQuality: ProjectionQuality;
}

interface MovieTheaterApiResponse {
    'hydra:member': MovieTheater[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}