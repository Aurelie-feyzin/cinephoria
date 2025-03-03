'use client';

import React, {useState} from "react";
import PageIntranetContainer from "../../../components/intranet/PageIntranetContainer";
import {useMutation, useQuery} from "react-query";
import Table, {Column} from "../../../components/common/Table";
import PageLoading from "../../../components/common/PageLoading";
import Pagination from "../../../components/common/Pagination";
import {fetchReviews, updateReviewById} from "../../../request/review";
import ValidIcon from "../../../components/common/Icon/ValidIcon";
import RefuseIcon from "../../../components/common/Icon/RefuseIcon";
import {fetchEnums, URL_ENUM} from "../../../request/api";
import AlertError from "../../../components/common/alert/AlertError";
import {ApiResponse} from "../../../model/ApiResponseType";
import {Review} from "../../../model/Review";
import {useUser} from "../../../context/UserContext";


const ReviewList = () => {
    const {refreshAccessToken} = useUser();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [published, setPublished] = useState<string>();
    const [rejected, setRejected] = useState<string>();
    const [messageKo, setMessageKo] = useState<string | undefined>(undefined);

    const submitted = 'en cours de validation'
    const itemsPerPage = 30;

    const {
        data: dataReviews,
        error,
        isLoading,
        refetch
    } = useQuery<ApiResponse<Review>, Error>(['reviews', submitted, currentPage], () => fetchReviews(currentPage, itemsPerPage, submitted, refreshAccessToken), {
        keepPreviousData: true,
    });

    const reviews = dataReviews?.['hydra:member'] || [];
    const nextPageUrl = dataReviews?.['hydra:view']?.['hydra:next'];

    const {error: errorStatus, isLoading: isLoadingStatus} = useQuery(
        ['review_statuses'], () => fetchEnums(URL_ENUM.review_status), {
            onSuccess: (data) => {
                setPublished(data.find((status) => status['@id'].includes('PUBLISHED'))?.['@id']);
                setRejected(data.find((status) => status['@id'].includes('REJECTED'))?.['@id']);
            }
        }
    )

    const mutation = useMutation({
        mutationFn: (reviewData: any) => updateReviewById(reviewData.id as string, reviewData, refreshAccessToken),
        onSuccess: () => {
            refetch()
        },
        onError: () => {
            setMessageKo('Erreur lors de la mise à jour');
        },
    })

    const handleEditReview = (reviewId: string, status: string) => {
        try {
            const reviewUpdated = {
                id: reviewId,
                status
            }
            mutation.mutate(reviewUpdated)
        } catch (error) {
            setMessageKo('Erreur lors de la mise à jour');
        }
    };

    const columns: Column<Review>[] = [
        {key: 'reservation', label: 'Film', render: ((row: Review) => <span>{row.reservation.movieName}</span>)},
        {key: 'rating', label: 'Note'},
        {key: 'comment', label: 'Commentaire'},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex">
                    {isLoadingStatus && <PageLoading/>}
                    {
                        published && !isLoadingStatus &&
                        <span onClick={() => handleEditReview(row['@id'], published)} className="hover:bg-secondary mr-2">
                        <ValidIcon/>
                    </span>
                    }
                    {
                        rejected && !isLoadingStatus &&
                        <span onClick={() => handleEditReview(row['@id'], rejected)} className="hover:bg-secondary">
                        <RefuseIcon/>
                    </span>
                    }
                </div>
            ),
        },
    ];

    return <PageIntranetContainer titlePage="Avis à valider">
        <AlertError visible={!!messageKo || !!error}
                    titleMessage="Erreur pendant le traitement"
                    message={messageKo || error?.message}
        />
        {isLoading ? <PageLoading message="Récupération des avis en cours"/> :
            <>
                {errorStatus &&
                    <AlertError visible={!!errorStatus}
                                titleMessage="Erreur pendant la récupération des status"
                    />
                    }
                <Table columns={columns} data={reviews}/>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nextPageUrl={nextPageUrl}/>
            </>}
    </PageIntranetContainer>
}
export default ReviewList;