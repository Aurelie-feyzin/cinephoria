import Cookies from "js-cookie";


export const fetchReviews = async (page: number, itemsPerPage: number, status: string): Promise<ApiResponse<Review>> => {
    const url = `/reviews?page=${page}&itemsPerPage=${itemsPerPage}&status=${status}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        }
    });
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

export const updateReviewById = async (url: string, reviewData: any) => {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(reviewData),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la modification de la séance')
    }
    return response.json()
}

export const createReview = async (reviewInput: ReviewInput) => {
    const response = await fetch(`/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify(reviewInput),
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'avis');
    }

    return await response.json()
}