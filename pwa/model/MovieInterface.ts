interface Movie {
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

interface MinimalMovie {
    '@id': string,
    id: string,
    '@type': string,
    title: string,
    duration?: number,
    description?: string,
}

interface MovieDescription {
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
    releaseDate: Date,
    rating: number,
}

interface MovieDescriptionInput {
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

interface MovieDescriptionApiResponse {
    'hydra:member': MovieDescription[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}

interface MovieApiResponse {
    'hydra:member': Movie[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
}
