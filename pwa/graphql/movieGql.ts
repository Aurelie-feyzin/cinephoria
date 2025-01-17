import { gql } from '@apollo/client/core';


export const GET_MOVIES = gql`
    query GetMovies()
    {
         movies() {
            id
            title
            posterPath
            description
            ageRestriction
            warning
            duration
            rating
            genres (id: $genreId){
                id
                name
            }
            movieShows (date: $date){
                date
                startTime
                endTime
                priceInEuros
                movieTheater {
                    cinema {
                        name
                    }
                    projectionQuality {
                        name
                    }
                    theaterName
                }
                    }
                }
            }          

        }
    }
`;