import React from 'react';
import CinemaInfo from "../CinemaInfo";
import {useCinemas} from "../../../context/CinemaContext";
import PageLoading from "../PageLoading";
import PageError from "../PageError";


const Footer: React.FC = () => {
    const {cinemas, isLoading, error} = useCinemas();

    return (
        <footer className="bg-black p-4 text-white">
            {isLoading && <PageLoading message="Récupération de la liste des cinemas en cours"/>}
            {error && <PageError message={error.message}/>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4  mx-auto lg:max-w-7xl text-white">
                {cinemas?.map((cinema) => (
                    <CinemaInfo cinema={cinema} key={cinema.id}/>
                ))}
            </div>
            <div className="w-full p-4 text-center">
                © 2024 Copyright for ECF Bachelor CDA Symfony
            </div>
        </footer>
    );
};

export default Footer;