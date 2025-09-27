'use client'
import {SubmitHandler, useForm} from "react-hook-form";

import React, {Dispatch, SetStateAction} from "react";
import {fetchMovieTheatersByCinema, MovieTheater} from "@/app/api/movieTheaterApi";
import ButtonSubmit from "./button/ButtonSubmit";
import {REQUIRED} from "@/app/lib/validator_tools";
import SelectField from "@/app/ui/form/SelectField";
import {formatToSelectOption} from "@/app/lib/form_tools";
import {
    fetchGetInstallationByMovieTheater,
    fetchInstallationStatus,
    Installation,
    InstallationMinimalDescription,
    updateInstallation
} from "@/app/api/installationApi";
import {useMutation, useQuery} from "@tanstack/react-query";
import TextAreaField from "@/app/ui/form/TextAreaField";
import {fetchCinemas, MinimalCinema} from "@/app/api/cinemaApi";
import InputField from "@/app/ui/form/InputField";
import {useRouter} from "next/navigation";
import {Enum} from "@/app/api/apiResponseType";

export interface InstallationInput {
    '@id': string;
    '@type': string,
    name: string;
    installation: string;
    movieTheater: string;
    cinema: string;
    status: string;
    repairDetails: string;
    lastMaintenanceDate: string;
    lastRepairDate: string;
}

const InstallationForm = ({installation, setMessageKo}:
                          {
                              installation?: Installation,
                              setMessageKo: Dispatch<SetStateAction<string | undefined>>
                          }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm<InstallationInput, Error>({
        defaultValues: installation ? {
            ...installation,
            movieTheater: installation.movieTheater ? installation.movieTheater['@id'] : undefined,
            cinema: installation.movieTheater ? installation.movieTheater.cinema['@id'] : undefined,
            installation: installation['@id'],
            status: installation?.status['@id'],
            lastRepairDate: installation.lastRepairDate ? new Date(installation.lastRepairDate).toLocaleDateString('en-CA') : undefined,
            lastMaintenanceDate: installation.lastMaintenanceDate ? new Date(installation.lastMaintenanceDate).toLocaleDateString('en-CA') : undefined,
        } : {
            cinema: '',
            movieTheater: '',
            installation: '',
        },
    },);

    const watchCinema = watch("cinema");
    const watchMovieTheater = watch("movieTheater");
    const watchInstallation = watch("installation");
    const router = useRouter();


    const {data: cinemas, error: errorCinemas, isLoading: isLoadingCinemas} = useQuery<MinimalCinema[], Error>({
        queryKey: ['cinemas'],
        queryFn: () => fetchCinemas()
    });

    const {
        data: movieTheaters,
        error: errorMovieTheaters,
        isLoading: isLoadingMovieTheaters
    } = useQuery<MovieTheater[], Error>({
            queryKey: ['movie_theaters', watchCinema],
            queryFn: () => fetchMovieTheatersByCinema(watchCinema),
            enabled: !!watchCinema,
        },
    );

    const {
        data: listStatus,
        error: errorInstallationStatus,
        isLoading: isLoadingInstallationStatus
    } = useQuery<Enum[], Error>(
        {
            queryKey: ['installation_status'],
            queryFn: () => fetchInstallationStatus(),
        }
    );

    const {
        data: installations,
        error: errorInstallation,
        isLoading: isLoadingInstallation
    } = useQuery<InstallationMinimalDescription[], Error>(
        {
            queryKey: ['installations', watchMovieTheater],
            queryFn: () => fetchGetInstallationByMovieTheater(watchMovieTheater as string),
            enabled: !!watchMovieTheater,
        }
    );

    const mutation = useMutation({
        mutationFn: (installationData: InstallationInput) => updateInstallation(watchInstallation, installationData),
        onSuccess: (response) => {
            const id = response.id;
            router.push(`/installations/${id}`);
        },
        onError: () => {
            setMessageKo('Erreur lors de la modification d\'une installation');
        },
    })

    const onSubmit: SubmitHandler<InstallationInput> = async (data) => {
        try {
            mutation.mutate(data)
        } catch (error) {
            console.log(error);
            setMessageKo('Erreur lors de la modification d\'une installation');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="max-w-full mx-auto bg-black p-6 rounded-lg shadow-md">
                <div className="flex max-w-full gap-4">
                    <SelectField label="Cinema" name="cinema" register={register("cinema", {...REQUIRED})}
                                 options={formatToSelectOption(cinemas || [], '@id', 'name')}
                                 error={errors.cinema?.message || errorCinemas?.message}
                                 className="w-full"
                                 placeholder="Choisissez un cinema"
                                 isLoading={isLoadingCinemas}
                    />

                    <SelectField label="Salle" name="movieTheater" register={register("movieTheater", {...REQUIRED})}
                                 options={formatToSelectOption(movieTheaters || [], '@id', 'theaterName')}
                                 error={errors.movieTheater?.message || errorMovieTheaters?.message}
                                 className="w-full"
                                 placeholder="Choisissez une salle"
                                 isLoading={isLoadingMovieTheaters}
                    />
                    <SelectField label="Installation" name="movieTheater"
                                 register={register("installation", {...REQUIRED})}
                                 options={formatToSelectOption(installations || [], '@id', 'name')}
                                 error={errors.movieTheater?.message || errorInstallation?.message}
                                 className="w-full"
                                 placeholder="Choisissez une installation"
                                 isLoading={isLoadingInstallation}
                    />
                </div>
                <div className="flex max-w-full gap-4">
                    <TextAreaField
                        register={register("repairDetails", {...REQUIRED})}
                        name='repairDetails'
                        label='Description du problème'
                        error={errors.repairDetails?.message}
                    />
                </div>
                <div className="flex max-w-full gap-4">
                    <SelectField label="Status" name="status" register={register("status", {...REQUIRED})}
                                 options={formatToSelectOption(listStatus || [], '@id', 'value')}
                                 error={errors.status?.message || errorInstallationStatus?.message}
                                 className="w-full"
                                 placeholder="Choisissez un status"
                                 isLoading={isLoadingInstallationStatus}
                    />
                    <InputField register={register("lastRepairDate", {valueAsDate: true})}
                                type="date"
                                name='lastRepairDate'
                                label='Date dernière réparation'
                                error={errors.lastRepairDate?.message}
                                className="w-full"
                    />
                    <InputField register={register("lastMaintenanceDate", {valueAsDate: true})}
                                type="date"
                                name='lastMaintenanceDate'
                                label='Date dernière maintenance'
                                error={errors.lastMaintenanceDate?.message}
                                className="w-full"
                    />

                </div>
                <ButtonSubmit/>
            </form>
        </div>
    )

}

export default InstallationForm;