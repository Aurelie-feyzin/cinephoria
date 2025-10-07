'use client';

import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {useQuery} from "react-query";
import {fetchReviewsByMovieId} from "../../request/review";
import StarIcon from "./Icon/StarIcon";
import Pagination from "./Pagination";
import AlertInfo from "./alert/AlertInfo";
import AlertError from "./alert/AlertError";
import {ApiResponse} from "../../model/ApiResponseType";
import {Review} from "../../model/Review";
import {MovieDescription} from "../../model/MovieInterface";

type Props = {
    movie: MovieDescription,
    setSelectedMovie?: Dispatch<SetStateAction<MovieDescription|null>>
};

const FullMovieCard: React.FC<Props> = ({
                                            movie,
                                            setSelectedMovie
                                        }) => {
    const [showFullSynopsis, setShowFullSynopsis] = useState(false);
    const synopsisRef = useRef<HTMLDivElement | null>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [maxLines, setMaxLines] = useState(3);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [nextPageUrl, setNextPageUrl] = useState<string>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const {
        error,
        isLoading,
    } = useQuery<ApiResponse<Review>, Error>(['reviews_by_movie', movie['@id'], itemsPerPage, currentPage], () =>
        fetchReviewsByMovieId(currentPage, itemsPerPage, movie['@id']), {
        keepPreviousData: true,
        enabled: !!movie['@id'],
        onSuccess: (data) => {
            setReviews(data['hydra:member']);
            setTotalItems(data['hydra:totalItems']);
            setNextPageUrl(data['hydra:view']?.['hydra:next']);
        },
    });

    // This function is triggered on window resize to adjust the maximum lines of text shown
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setMaxLines(3);
                setItemsPerPage(1);
            } else if (width < 1024) {
                setMaxLines(5);
                setItemsPerPage(3);
            } else {
                setMaxLines(7);
                setItemsPerPage(5);
            }
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

    return (
        <div className="bg-black text-white rounded-lg shadow-md overflow-hidden m-4">
            <div className="flex flex-col md:flex-row" onClick={() => setSelectedMovie ? setSelectedMovie(movie) : null}>
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
                            onClick={(event) => { event.stopPropagation(); setShowFullSynopsis(!showFullSynopsis);}}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            {showFullSynopsis ? 'Voir moins' : 'Voir plus'}
                        </button>
                    )}

                    <div className="flex flex-col lg:flex-row justify-between items-center mt-4">
                        <div>
                            <span>{movie.ageRestriction?.value}+</span>
                            {movie.warning && <span className="text-orange-500 ml-2">⚠️ {movie.warning}</span>}
                        </div>
                        <div>{movie.genres.map((genre) => genre.name).join(', ')}</div>
                        <div className="text-secondary font-bold">⭐ {movie.rating === 0 ? '-' : movie.rating} / 5</div>
                    </div>
                </div>

            </div>
            {isLoading && <AlertInfo visible={isLoading} titleMessage="Avis en cours de chargement" />}
            {error && <AlertError visible={!!error} titleMessage="Impossible de charger les avis" />}
            {totalItems > 0 &&
            <div className="p-2">
                <div className="w-full h-1 bg-primary_light mb-2"></div>

                <span className="block text-center">
        {`Avis (${totalItems})`}
    </span>
                {reviews.map((review) =>
                    <div key={review['@id']} className="mb-2">
                        <div className="inline-flex items-center">
                            {Array(review.rating).fill(<StarIcon color='secondary'/>).map((star, index) =>
                                <span key={index}>{star}</span>
                            )}
                            {Array(5 - review.rating).fill(<StarIcon color='white'/>).map((star, index) => (
                                <span key={index}>{star}</span>
                            ))}
                        </div>
                        <span> - {review.comment}</span>
                    </div>
                )}
                {totalItems > itemsPerPage && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nextPageUrl={nextPageUrl} light/>}
            </div>
            }
        </div>
    );
}

export default FullMovieCard;