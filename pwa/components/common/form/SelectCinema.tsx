import React from "react";
import {useCinemas} from "../../../context/CinemaContext";

const SelectCinema = ({register, forceSelect = false}: { register: any, forceSelect: boolean }) => {
    const {cinemas, isLoading, error: errorCinema} = useCinemas();

    return (
        <>
            <label htmlFor="cinema-filter" className="block text-secondary font-semibold mb-2">
                Cinéma
            </label>
            <select
                id="cinema-filter"
                {...register('cinema')}
                className="w-full p-2 border rounded-md"
            >
                <option value='' disabled={forceSelect}>{
                    forceSelect ? 'Sélectionnez votre cinéma' : 'Tous les cinémas'}
                </option>
                {cinemas.map((cinema) => (
                    <option key={cinema['@id']} value={cinema['@id']}>
                        {cinema.name}
                    </option>
                ))}
            </select>
            {isLoading &&
                <p role="alert" className="block text-white text-sm">Liste des cinémas en cours de chargement</p>}
            {errorCinema && <p role="alert" className="block text-white text-sm">{errorCinema.message}</p>}
        </>
    )
}

export default SelectCinema;