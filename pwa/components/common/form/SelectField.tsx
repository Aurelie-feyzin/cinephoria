import {Option} from "./utils";
import React, {ReactNode} from "react";

const SelectField = ({register, error, name, label, multiple = false, options, className, placeholder, children}: {
    register: any,
    name: string,
    label: string,
    multiple?: boolean,
    options: Option[],
    error: string | undefined,
    className?: string,
    placeholder?: string,
    children?: ReactNode
}) => (
    <div className={`${className} mb-4`}>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">{label}</label>
        <select    {...register}
                   multiple={multiple}
                   className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
        >
            {placeholder && <option value='' disabled selected>{placeholder}</option>}
            {options.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
            ))}
        </select>
        {children}
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)


export default SelectField;