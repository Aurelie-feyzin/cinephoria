import React, {useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import {useQuery} from "react-query";
import dayjs from "dayjs";
import FullMovieCard from "../components/common/FullMovieCard";

const fetchMovieInCinema = async(today: string, lastDay: string) =>
    await (await fetch(`https://localhost/movies?page=1&movieShows.date%5Bbefore%5D=${lastDay}&movieShows.date%5Bafter%5D=${today}`)).json();
const Movies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const lastDay = now.add(6, 'day').format('YYYY-MM-DD');
    const {error, status} = useQuery("movie_in_cinema", () => fetchMovieInCinema(today, lastDay), {
        onSuccess: (data) => {
            const newMovies = data["hydra:member"];
            setMovies(newMovies);
        }
    });

 return <PageContainer title='les films' titlePage="Actuellement en salle">
     <div className="container mx-auto p-6">
       <div className="grid grid-cols-1">
             {
                 movies.map((movie) => <FullMovieCard key={movie.id} movie={movie}/>)
             }
         </div>
     </div>


 </PageContainer>
};
export default Movies;
