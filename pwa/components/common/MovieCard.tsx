import React from 'react';
import Image from "next/image";
import ClockIcon from "./Icon/ClockIcon";
import {Movie} from "../../model/MovieInterface";

type Props = {
    movie: Movie
};

const MovieCard:React.FC<Props>  = ({movie }) => {
    if (!movie) {
        return;
    }

    const posterPath = movie.posterPath?.replace(/\.[^/.]+$/, "");
    const blurData = require(`../../public/poster-optimized/${posterPath}-blur.json`);

    return (
        <div className="flex flex-col sm:flex-row bg-black rounded-lg shadow-lg p-2 w-full max-w-2xl">
            <div className="flex justify-center md:justify-start mb-2 md:mb-0">
            <Image
                placeholder="blur"
                blurDataURL={blurData.blurDataURL}
                src={`/poster-optimized/${posterPath}-small.webp`}
                alt={`Poster de ${movie.title}`}
                width={150}
                height={225}
                className={`w-[150px] md:w-[300px] object-cover rounded-lg shadow-md mr-0 md:mr-4 mb-4 md:mb-0 items-center`}
            />
            </div>
            <div className="flex-1 sm:ml-4 text-white text-center sm:text-left">
                <h2 className="text-xl font-bold mb-4 text-secondary text-center hidden sm:block">{movie.title}</h2>
                <hr className="w-48 h-1 my-8 mx-auto bg-primary border-0 dark:bg-primary hidden sm:block"/>
                <p className="text-sm text-white mb-3 text-center sm:text-left">
                    <span className="hidden sm:inline">Genres:</span> {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
                <p className="text-sm text-white mb-3 inline-flex items-center">
                    <ClockIcon ariaLabel="Durée du film"/> &nbsp;{movie.duration} min
                </p>
                <p className="text-sm text-white mb-3 space-x-1">
                    <span className="hidden sm:inline">Âge:</span> {movie.ageRestriction?.value || 'N/A'}
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