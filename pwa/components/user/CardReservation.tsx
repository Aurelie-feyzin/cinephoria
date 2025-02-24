import React, {useState} from "react";
import {useQuery} from "react-query";
import {fetchUserReservations} from "../../request/reservation";
import PageLoading from "../common/PageLoading";
import AlertError from "../common/alert/AlertError";
import Image from "next/image";
import Pagination from "../common/Pagination";
import {orderBy} from "lodash";
import UserMovieRating from "./UserMovieRating";
import UserMovieComment from "./UserMovieComment";
import UserReviewStatus from "./UserReviewStatus";


const CardReservation = ({past}: { past: boolean }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data: userReservationData,
        error: userReservationError,
        isLoading: userReservationLoading,
        refetch,
    } = useQuery<ApiResponse<Reservation>, Error>(['movies_theaters', currentPage], () => fetchUserReservations(past, currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const reservations: Reservation[] = orderBy(userReservationData?.['hydra:member'], 'movieShowDate', past ? 'desc' : 'asc') || [];
    const hasPagination: boolean = !!userReservationData?.['hydra:view']?.['hydra:last'];
    const nextPageUrl: string | undefined = userReservationData?.['hydra:view']?.['hydra:next'];

    return (
        <>
            {userReservationLoading && <PageLoading/>}
            <AlertError visible={!!userReservationError}
                        titleMessage="Erreur pendant la récupération de vos réservations"
            />
            {reservations.map((reservation) => (
                <div key={reservation.id}>
                <div key={reservation.id} className="bg-black p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start">
                    <Image
                        src={`/backdrop/${reservation.movieBackdropPath}`}
                        alt={reservation.movieName}
                        width={300}
                        height={150}
                        className="w-[150px] h-auto md:w-[300px] object-cover rounded-lg shadow-md"
                    />

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col">
                        <h2 className="text-xl font-semibold text-secondary text-center">
                            {reservation.movieName}
                        </h2>

                        <div className="p-4 text-white text-left md:hidden">
                            <p className="pb-2">
                                Le {new Date(reservation.movieShowDate).toLocaleDateString()} de {reservation.movieShowStartTime} à {reservation.movieShowEndTime}
                            </p>
                            <p className="pb-2">
                                {reservation.cinemaName}, salle {reservation.movieTheaterName}
                            </p>
                            <p>Sièges: {reservation.seatNames.join(", ")}</p>
                        </div>
                        <div className="p-4 text-white text-left hidden md:block">
                            <p className="pb-2">
                                Le {new Date(reservation.movieShowDate).toLocaleDateString()} de {reservation.movieShowStartTime} à {reservation.movieShowEndTime}
                                , {reservation.cinemaName}, salle {reservation.movieTheaterName}
                                , sièges: {reservation.seatNames.join(", ")}
                            </p>
                        </div>
                    </div>
                </div>
            {past && <div>
                <UserMovieRating reservation={reservation} refetch={refetch} />
                <UserMovieComment refetch={refetch} reservation={reservation} />
                {reservation.review && <UserReviewStatus review={reservation.review} />}
            </div>}
                </div>
            ))}
            {hasPagination && <Pagination nextPageUrl={nextPageUrl} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        </>
    );
}

export default CardReservation;