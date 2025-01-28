import {UseMutationResult, useQuery} from "react-query";
import {fetchAgeRestrictions} from "../../../request/ageRestriction";
import {fetchMovieGenres} from "../../../request/movieGenre";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../../common/form/InputField";
import {customMaxLength, REQUIRED} from "../../common/form/validator_tools";
import TextAreaField from "../../common/form/TextAreaField";
import SelectField from "../../common/form/SelectField";
import {formatToSelectOption} from "../../common/form/utils";
import RadioButtons, {OptionBooleans} from "../../common/form/RadioButtons";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import React, {SetStateAction} from "react";
import dayjs from "dayjs";


const MovieForm = ({movieData, mutation, setMessageKo}:
                   {
                       movieData?: MovieDescription,
                       mutation: UseMutationResult,
                       setMessageKo: SetStateAction<any>
                   }) => {
    const {data: ageRestrictions, error: errorAge, isLoading: isLoadinAge} = useQuery(
        ['age_registrations'], () => fetchAgeRestrictions(),
    )
    const {data: movieGenres, error: errorGenre, isLoading: isLoadinGenre} = useQuery(
        ['movie_genres'], () => fetchMovieGenres(),
    )
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<MovieDescriptionInput>({
        defaultValues: movieData ? {
            ...movieData,
            releaseDate: movieData.releaseDate ? dayjs(movieData.releaseDate).format('YYYY-MM-DD') : undefined,
            genres: movieData.genres.map((genre: MovieGenre) => genre['@id']),
            ageRestriction: movieData.ageRestriction ? movieData.ageRestriction['@id'] : undefined,
            warning: String(!!movieData.warning),
            favorite: String(movieData.favorite),
        } : {},
        values: {
            ...movieData,
            releaseDate: movieData?.releaseDate ? dayjs(movieData.releaseDate).format('YYYY-MM-DD') : undefined,
            genres: movieData?.genres.map((genre: MovieGenre) => genre['@id']),
            ageRestriction: movieData?.ageRestriction ? movieData.ageRestriction['@id'] : undefined,
            warning: String(!!movieData?.warning),
            favorite: String(movieData?.favorite),
        } as MovieDescriptionInput
    },);
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            data = {
                ...data,
                favorite: data.favorite === 'true',
                warning: data.warning === 'true',
            }
            mutation.mutate(data)
        } catch (error) {
            setMessageKo("Erreur, film non modifié");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
                <InputField
                    register={register("title", {...REQUIRED, ...customMaxLength(255)})}
                    name='title'
                    label='Titre'
                    error={errors.title?.message}
                />
                <TextAreaField
                    register={register("description", {...REQUIRED})}
                    name='description'
                    label='Synopsis'
                    placeholder="Le synopsis du film"
                    error={errors.description?.message}
                />
                <InputField register={register("duration", {...REQUIRED, valueAsNumber: true})}
                            type="number"
                            name='duration'
                            label='Durée (min)'
                            error={errors.duration?.message}
                />
                <InputField register={register("releaseDate", {...REQUIRED, valueAsDate: true})}
                            type="date"
                            name='releaseDate'
                            label='Date de sortie'
                            error={errors.releaseDate?.message}
                />
                <SelectField label="Age minimun" name="ageRestriction" register={register("ageRestriction")}
                             options={formatToSelectOption(ageRestrictions || [], '@id', 'value')}
                             error={errors.ageRestriction?.message}
                />
                <SelectField multiple label="Genres" name="genres" register={register("genres")}
                             options={formatToSelectOption(movieGenres || [], '@id', 'name')}
                             error={errors.duration?.message}
                />
                <RadioButtons legend="Coup de coeur" name='favorite' options={OptionBooleans}
                              register={register("favorite")} error={errors.favorite?.message}/>
                <RadioButtons legend="Avertissement" name='warning' options={OptionBooleans}
                              register={register("warning")} error={errors.warning?.message}/>

                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default MovieForm;