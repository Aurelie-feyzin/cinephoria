interface Cinema {
    id: number;
    name: string;
    address: Address;
    phoneNumber: string;
    openingHours: OpeningHours[];
}

interface MinimalCinema {
    '@id': string;
    '@type': string,
    name: string;
}