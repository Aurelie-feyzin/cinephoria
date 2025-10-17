import {Dispatch, SetStateAction} from "react";

interface Pagination {
    nextPageUrl?: string,
    currentPage: number,
    setCurrentPage:  Dispatch<SetStateAction<number>>
}

type PaginationComponent = {
    nextPageUrl?: string,
    currentPage: number,
    setCurrentPage:  Dispatch<SetStateAction<number>>
    light?: boolean
}

const Pagination = ({nextPageUrl, currentPage, setCurrentPage, light = false}: PaginationComponent) => {
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className={`mt-${light ? 2: 4} flex justify-center`}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-${light ?1:2}  mx-1 ${light ? 'bg-primary_light text-black': 'bg-primary text-white'}  rounded-lg hover:bg-secondary disabled:bg-gray-400`}
            >
                Précédent
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!nextPageUrl}
                className={`px-4 py-${light ?1:2}  mx-1 ${light ? 'bg-primary_light text-black': 'bg-primary text-white'}  rounded-lg hover:bg-secondary disabled:bg-gray-400`}
            >
                Suivant
            </button>
        </div>
    )
}

export default Pagination;