import React from 'react';
import Image from "next/image";

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
        <div className={`flex ${mirror ? 'flex-row-reverse' : 'flex-row'} bg-black rounded-lg shadow-lg p-4 w-full max-w-2xl`}>
            <Image
                src={`/poster/${movie.posterPath}`}
                alt={'test2'}
                width={300}
                height={450}
                className="object-cover rounded-lg shadow-md mr-4 items-center"
            />
            <div className="flex-1 ml-4 text-white mt-2">
                <h2 className="text-xl font-bold mb-4 text-secondary text-center">{movie.title}</h2>
                <hr className="w-48 h-1 my-8 mx-auto bg-primary border-0 dark:bg-primary"/>
                <p className="text-sm text-white mb-3">
                    Genres: <span className="text-white">{movie.genres.map((genre) => genre.name).join(', ')}</span>
                </p>
                <p className="text-sm text-white mb-3">
                    Durée: <span className="text-white">{movie.duration} min</span>
                </p>
                <p className="text-sm text-white mb-3">
                    Âge minimum: <span className="text-white">{movie.ageRestriction || 'N/A'}</span>
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