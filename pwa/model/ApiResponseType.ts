type ApiResponse<T> = {
    'hydra:member': T[];
    'hydra:totalItems': number;
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
};

type Enum = {
    '@id': string,
    '@type' : string,
    value: string,
}