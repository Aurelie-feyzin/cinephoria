import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataCinemasContextProps {
    '@context': string,
    '@id': string,
    '@type': string,
    'hydra:member': Cinema[],
    'hydra:totalitems': number;
}

const CinemasContext = createContext<Cinema[]>([]);

export const useCinemas = () => useContext(CinemasContext);

export const CinemasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    useEffect(() => {
        const fetchCinemas = async () => {
            const res = await fetch('https://localhost/cinemas');
            const data: DataCinemasContextProps = await res.json();
            setCinemas(data['hydra:member']);
        };
        fetchCinemas();
    }, []);

    return (
        <CinemasContext.Provider value={ cinemas }>
            {children}
        </CinemasContext.Provider>
    );
};