import {Dispatch, SetStateAction} from "react";

interface Pagination {
    nextPageUrl?: string,
    currentPage: number,
    setCurrentPage:  Dispatch<SetStateAction<number>>
}

const Pagination = ({nextPageUrl, currentPage, setCurrentPage}: Pagination) => {
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="mt-4 flex justify-center">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-400"
            >
                Précédent
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!nextPageUrl}
                className="px-4 py-2 mx-1 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-400"
            >
                Suivant
            </button>
        </div>
    )
}

export default Pagination;