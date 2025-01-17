
interface MovieShow {
    '@id': string;
    '@type': string,
    date: Date;
    startTime: string;
    endTime: string;
    priceInEuros: number;
    movieTheater: MovieTheater;
}