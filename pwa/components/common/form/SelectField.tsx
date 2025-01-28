import {Option} from "./utils";
import React from "react";

const SelectField = ({register, error, name, label, multiple = false, options}: { register: any, name: string, label: string, multiple?: boolean, options: Option[], error: string | undefined }) => (
    <div className="mb-4 ">
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">{label}</label>
        <select    {...register}
                multiple={multiple}
                className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {options.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
            ))}
        </select>
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)


export default SelectField;