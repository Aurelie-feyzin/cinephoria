import {Option} from "./utils";
import React from "react";

export const OptionBooleans: Option[] = [
    {id: 'true', value: 'true', label: 'Oui'},
    {id: 'false', value: 'false', label: 'Non'},
]
const RadioButtons = ({register, error, legend, name, options } : {register: any,legend: string, name:string, options:Option[], error: string | undefined}) => (
    <fieldset className="flex mb-4">
        <legend className="sr-only">{legend}</legend>

        <label className="block font-medium text-white mr-4">{legend}</label>

        {options.map((option) => (
            <div className="flex items-center mr-4"  key={option.id}>
                <input
                    {...register}
                    id={option.id}
                    type="radio"
                    name={name}
                    value={String(option.value)}
                    className="w-4 h-4 border-primary focus:ring-2 focus:bg-secondary"
                />
                <label
                    htmlFor={option.id}
                    className="block ml-2 text-sm font-medium text-primary"
                >
                    {option.label}
                </label>
            </div>
        ))}
        <p role="alert" className="block text-white text-sm">{error}</p>
    </fieldset>
)

export default RadioButtons;