import React from 'react';
import CinemaInfo from "../CinemaInfo";

interface FooterProps {
    cinemas: Cinema[];
}

const Footer: React.FC<FooterProps> = ({cinemas}) => {
    if (!cinemas) {
        return;
    }
    return (
        <footer className="bg-black p-4 text-white">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4  mx-auto lg:max-w-7xl text-white">
                {cinemas.map((cinema) => (
                    <CinemaInfo cinema={cinema} key={cinema.id}/>
                ))}
            </div>
            <div className="w-full p-4 text-center text-primary">
                © 2024 Copyright for ECF Bachelor CDA Symfony
            </div>
        </footer>
    );
};

export default Footer;