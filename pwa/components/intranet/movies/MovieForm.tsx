import {UseMutationResult, useQuery} from "react-query";
import {fetchMovieGenres} from "../../../request/movieGenre";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "../../common/form/InputField";
import {customMaxLength, REQUIRED} from "../../common/form/validator_tools";
import TextAreaField from "../../common/form/TextAreaField";
import SelectField from "../../common/form/SelectField";
import {formatToSelectOption, Option} from "../../common/form/utils";
import RadioButtons, {OptionBooleans} from "../../common/form/RadioButtons";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import React, {SetStateAction} from "react";
import dayjs from "dayjs";
import {fetchEnums, URL_ENUM} from "../../../request/api";
import {MovieDescription, MovieDescriptionInput} from "../../../model/MovieInterface";
import {MovieGenre} from "../../../model/MovieGenreInterface";


const MovieForm = ({movieData, mutation, setMessageKo}:
                   {
                       movieData?: MovieDescription,
                       mutation: UseMutationResult,
                       setMessageKo: SetStateAction<any>
                   }) => {
    const {data: ageRestrictions, error: errorAge, isLoading: isLoadinAge} = useQuery(
        ['age_registrations'], () => fetchEnums(URL_ENUM.age_restriction),
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
    },);
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            data = {
                ...data,
                // Convert the string value of ('true' or 'false') to a boolean
                favorite: data.favorite === 'true',
                warning: data.warning === 'true',
            }
            mutation.mutate(data)
        } catch (error) {
            setMessageKo("Erreur, film non modifié");
        }
    }

    const getDates = () => {
        const now = dayjs();
        const wednesday = now.day(3);
        const optionDates: Option[] = [];
        let nbAddDate = 4;
        if (wednesday.format('YYYY-MM-DD') >= now.format('YYYY-MM-DD')) {
            nbAddDate = 3;
            optionDates.push({
                id: wednesday.format('YYYY-MM-DD'),
                value: wednesday.format('YYYY-MM-DD'),
                label: wednesday.format('DD/MM/YYYY'),
            });
        }
        for (let i = 1; i < (nbAddDate+1); i++) {
            const newDate = wednesday.add(i*7, 'day');
            optionDates.push({
                id: newDate.format('YYYY-MM-DD'),
                value: newDate.format('YYYY-MM-DD'),
                label: newDate.format('DD/MM/YYYY'),
            });
        }

        return optionDates;
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
                <SelectField label="Date de sortie" name="releaseDate" register={register("releaseDate", {...REQUIRED,  valueAsDate: true})}
                             options={getDates() || []}
                             error={errors.releaseDate?.message}
                             className="w-full"
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