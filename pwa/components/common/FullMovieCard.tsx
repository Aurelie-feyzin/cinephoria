import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";

type Props = {
    movie: Movie
};

const FullMovieCard:React.FC<Props>  = ({
                       movie,
                   }) => {
    const [showFullSynopsis, setShowFullSynopsis] = useState(false);
    const synopsisRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [maxLines, setMaxLines] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            const newMaxLines = window.innerWidth >= 1024 ? 7 : 3;
            setMaxLines(newMaxLines);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (synopsisRef.current) {
            const lineHeight = parseFloat(getComputedStyle(synopsisRef.current).lineHeight);
            const maxLinesHeight = lineHeight * maxLines;
            const textHeight = synopsisRef.current.scrollHeight;

            setIsTruncated(textHeight > maxLinesHeight);
        }
    }, [maxLines, movie]);

    if (!movie) {
        return;
    }



    const toggleSynopsis = () => {
        setShowFullSynopsis(!showFullSynopsis);
    };

    return (
        <div className="flex flex-col md:flex-row bg-black text-white rounded-lg shadow-md overflow-hidden m-4">
            <div className="self-center min-w-[150px] md:min-w-[200px] p-2">
                <Image
                    src={`/poster/${movie.posterPath}`}
                    alt={`affiche de ${movie.title}`}
                    width={150}
                    height={225}
                    className={`w-[150px] md:w-[200px] object-cover rounded-lg shadow-md mr-4`}
                />
            </div>
            <div className="p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-secondary  text-center flex-1">{movie.title}</h2>
                    {movie.favorite && <span className="text-red-500 text-2xl ml-4">❤️</span>}
                </div>
                <p
                    ref={synopsisRef}
                    className={`flex-grow mb-4 transition-all ${showFullSynopsis ? '' : 'line-clamp-3 md:line-clamp-5'}`}
                >
                    {movie.description}
                </p>

                {isTruncated && (
                    <button
                        onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                        className="text-blue-500 hover:underline mt-2"
                    >
                        {showFullSynopsis ? 'Voir moins' : 'Voir plus'}
                    </button>
                )}

                <div className="flex flex-col lg:flex-row justify-between items-center mt-4">
                    <div>
                        <span>{movie.ageRestriction}+</span>
                        {movie.warning && <span className="text-orange-500 ml-2">⚠️ {movie.warning}</span>}
                    </div>
                    <div>{movie.genres.map((genre) => genre.name).join(', ')}</div>
                    <div className="text-secondary font-bold">⭐ {movie.rating} / 5</div>
                </div>
            </div>
        </div>
    );
}

export default FullMovieCard;