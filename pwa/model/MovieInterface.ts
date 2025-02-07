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

