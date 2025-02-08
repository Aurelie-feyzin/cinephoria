import React, {useEffect, useState} from "react";
import PageContainer from "../components/common/layout/PageContainer";
import {useUser} from "../context/UserContext";
import {useQuery} from "react-query";
import {fetchUserReservations} from "../request/reservation";
import AlertError from "../components/common/alert/AlertError";
import {useRouter} from "next/router";
import dayjs from "dayjs";
import Pagination from "../components/common/Pagination";
import PageLoading from "../components/common/PageLoading";

const Orders = () => {
    const {user} = useUser();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 30;

    const {
        data: userReservationData,
        error: userReservationError,
        isLoading: userReservationLoading,
    } = useQuery<ApiResponse<Reservation>, Error>(['movies_theaters', currentPage], () => fetchUserReservations(currentPage, itemsPerPage), {
        keepPreviousData: true,
    });

    const reservations: Reservation[] = userReservationData?.['hydra:member'] || [];
    const hasPagination: boolean = !!userReservationData?.['hydra:view']?.['hydra:last'];
    const nextPageUrl: string|undefined = userReservationData?.['hydra:view']?.['hydra:next'];

    useEffect(() => {
        if (!user) {
            router.push('/signIn').then();
        }
    }, [router, user]);

    return (
        <PageContainer title='Vos réservations' titlePage="Commandes">
            {userReservationLoading && <PageLoading />}
            <AlertError visible={!!userReservationError}
                        titleMessage="Erreur pendant la récupération de vos commandes"
            />
            <div className="container mx-auto bg-black text-white">
                    {reservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="flex flex-col md:flex-row bg-black rounded-lg shadow-lg p-4 w-full mb-4"
                    >
                        <div className="flex-1 ml-4 text-white mt-2 flex flex-col md:flex-row items-start md:items-center w-full">
                            <h2 className="text-xl font-bold text-secondary md:text-left md:flex-shrink-0 mr-4 mb-2 md:mb-0">
                                {`${reservation.cinemaName} - ${reservation.movieName}`}
                            </h2>
                            <div className="flex flex-col md:flex-row items-start md:items-center  md:lowercase space-y-2 md:space-y-0 md:space-x-2">
                                <p className="text-left w-auto">{`Le ${dayjs(reservation.movieShowDate).format('DD/MM/YYYY')} de ${reservation.movieShowStartTime} à ${reservation.movieShowEndTime}`}</p>
                                <p className="text-left w-auto md:mt-0">{`Salle ${reservation.movieTheaterName} pour ${reservation.numberOfSeats} personne(s)`}.</p>
                            </div>
                        </div>
                    </div>
                ))}
                {hasPagination && <Pagination nextPageUrl={nextPageUrl} currentPage={currentPage} setCurrentPage={setCurrentPage} />}

            </div>
        </PageContainer>
    );
}
export default Orders;