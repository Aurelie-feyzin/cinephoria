import React from "react";

const SelectField = ({register, error, name, label, multiple = false, options, className, placeholder, isLoading=false}: {
    register: any,
    name: string,
    label: string,
    multiple?: boolean,
    options: any[],
    error: string | undefined,
    className?: string,
    placeholder?: string
    isLoading?: boolean,
}) => (
    <div className={`${className} mb-4`}>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-white">{label}</label>
        <select    {...register}
                   multiple={multiple}
                   className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            {placeholder && <option value='' disabled>{placeholder}</option>}
            {options.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
            ))}
        </select>
        {isLoading && <p role="alert" className="block text-white text-sm">En cours de chargement</p>}
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)


export default SelectField;