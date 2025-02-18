import React from "react";


const InputField = ({type = 'text', name, label, register, error, className, disabled = false}:
                    { register: any, type?: string, name: string, label: string, error: string | undefined, className?: string, disabled?: boolean }) => (
    <div className={`${className} mb-4`}>
        <label className="block text-white" htmlFor={name}>{label}</label>
        <input
            {...register}
            type={type}
            disabled={disabled}
            className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded disabled:bg-gray-400"
        />
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)

export default InputField;