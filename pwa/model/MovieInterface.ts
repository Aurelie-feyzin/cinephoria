
interface Movie {
    '@id': string,
     id: string,
    '@type': string,
    title: string,
    posterPath?: string,
    duration?: number,
    description?: string,
    genres: MovieGenre[],
    ageRestriction?: string,
    warning?: string,
}
