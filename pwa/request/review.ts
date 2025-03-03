import Cookies from "js-cookie";
import {API_PATH} from "./utils";
import {ApiResponse} from "../model/ApiResponseType";
import {Review, ReviewInput} from "../model/Review";
import {fetchWithAuth} from "./auth";


export const fetchReviews = async (page: number, itemsPerPage: number, status: string, refreshAccessToken: () => Promise<string | null>): Promise<ApiResponse<Review>> => {
    const url = `${API_PATH}reviews?page=${page}&itemsPerPage=${itemsPerPage}&status=${status}`;
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    }, refreshAccessToken);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avis');
    }

    return await response.json();
}

export const fetchReviewsByMovieId = async (page: number, itemsPerPage: number, movieUri: string): Promise<ApiResponse<Review>> => {
    const url = `${movieUri}/reviews?page=${page}&itemsPerPage=${itemsPerPage}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avis');
    }

    return await response.json();
}

export const updateReviewById = async (url: string, reviewData: any, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(reviewData),
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la modification de la séance')
    }
    return response.json()
}

export const createReview = async (reviewInput: ReviewInput, refreshAccessToken: () => Promise<string | null>) => {
    const response = await fetchWithAuth(
        `${API_PATH}reviews`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(reviewInput),
    }, refreshAccessToken)
    if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'avis');
    }

    return await response.json()
}