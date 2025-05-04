export interface WithIdentifierBases {
    "@id": string;
    id?: string;
}

export type WithIdentifiers<T = unknown> = WithIdentifierBases & T;

export type ApiResponse<T> = {
    'hydra:member': WithIdentifiers<T>[];
    'hydra:totalItems': number;
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
};

export type Enum = {
    '@id': string,
    '@type' : string,
    value: string,
}