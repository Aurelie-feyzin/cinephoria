import React, { createContext, useContext, useState, useEffect } from 'react';
import {useQuery} from "react-query";
import {fetchCinemas} from "../request/cinema";

interface CinemaContextProps {
    cinemas: Cinema[],
    error: Error | null;
    isLoading: boolean;
}

const CinemasContext = createContext<CinemaContextProps>({} as CinemaContextProps);

export const useCinemas = () => useContext(CinemasContext);

export const CinemasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: cinemas = [], error, isLoading } = useQuery<Cinema[], Error>('cinemas',  fetchCinemas);

    return (
        <CinemasContext.Provider value={{cinemas, error, isLoading}}>
            {children}
        </CinemasContext.Provider>
    );
};