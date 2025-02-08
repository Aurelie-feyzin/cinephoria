type ApiResponse<T> = {
    'hydra:member': T[];
    'hydra:view'?: {
        'hydra:next'?: string;
        'hydra:last'?: string;
    };
};