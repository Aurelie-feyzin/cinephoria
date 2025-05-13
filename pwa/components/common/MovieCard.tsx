import React from 'react';
import Image from "next/image";
import ClockIcon from "./Icon/ClockIcon";
import {Movie} from "../../model/MovieInterface";

type Props = {
    movie: Movie
    mirror?: boolean
};

const MovieCard:React.FC<Props>  = ({
                       movie,
                       mirror = false // Permet de changer la position du poster (gauche/droite)
                   }) => {
    if (!movie) {
        return;
    }


    return (
        <div className="flex flex-row' bg-black rounded-lg shadow-lg p-4 w-full max-w-2xl">
            <Image
                src={`/poster/${movie.posterPath}`}
                alt={`/poster/${movie.posterPath}`}
                width={150}
                height={225}
                className={`w-[150px] md:w-[300px] object-cover rounded-lg shadow-md mr-4 items-center`}
            />
            <div className="flex-1 ml-4 text-white mt-2">
                <h2 className="text-xl font-bold mb-4 text-secondary text-center hidden sm:block">{movie.title}</h2>
                <hr className="w-48 h-1 my-8 mx-auto bg-primary border-0 dark:bg-primary hidden sm:block"/>
                <p className="text-sm text-white mb-3">
                    <span className="hidden sm:inline-flex">Genres:</span> {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
                <p className="text-sm text-white mb-3 inline-flex items-center">
                    <ClockIcon /> &nbsp;{movie.duration} min
                </p>
                <p className="text-sm text-white mb-3 space-x-1">
                    <span className="hidden sm:inline-flex">Âge:</span> {movie.ageRestriction?.value || 'N/A'}
                    {movie.warning && (
                        <span className="text-sm text-white mt-3">
                            &nbsp;avec avertissement
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;