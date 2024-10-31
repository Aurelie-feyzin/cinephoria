import React, {useState} from "react";
import {useQuery} from "react-query";
import PageContainer from "../components/common/PageContainer";
import MovieCard from "../components/common/MovieCard";

const fetchNewMovies = async () =>
    await (await fetch("https://localhost/movie/new_list")).json();

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [orphanLastMovie, setOrphanLastMovie] = useState([]);

    const {error, status} = useQuery("new_movies", fetchNewMovies, {
        onSuccess: (data) => {
            const newMovies = data["hydra:member"];
            setMovies(newMovies);
            setOrphanLastMovie(newMovies?.length % 2 != 0);
        }
    });

    if (status === "error") <div>{error.message}</div>
    if (status === "loading") <div>Loading...</div>

    return (
        <PageContainer
            title='les nouveautés'
            titlePage='Nos nouveautés de la semaine'
        >
            <>
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {movies.map((movie, index, {length}) => (
                            index === length - 1 && orphanLastMovie ?
                                <></>
                                :
                                <div className="flex flex-col items-center space-y-6 p-6" key={movie.id}>
                                    <MovieCard movie={movie} mirror={false}/>
                                </div>
                        ))
                        }
                    </div>
                </div>
                {orphanLastMovie &&
                    <div className="flex flex-col items-center space-y-6 p-6" key={movies[movies.length - 1]?.id}>
                        <MovieCard movie={movies[movies.length - 1]} mirror={false}/>
                    </div>}
            </>
        </PageContainer>
    )
}

export default HomePage;
