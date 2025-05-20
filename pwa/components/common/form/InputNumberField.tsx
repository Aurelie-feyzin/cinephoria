import React from "react";


const InputNumberField = ({name, label, register, error, className, min, max, disabled = false}:
                    { register: any, name: string, label: string, error: string | undefined, className?: string, min?: number, max?:number, disabled?: boolean }) => (
    <div className={`${className} mb-4`}>
        <label className="block text-white" htmlFor={name}>{label}</label>
        <input
            {...register}
            type="number"
            min={min}
            max={max}
            disabled={disabled}
            className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded disabled:bg-gray-400"
        />
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)

export default InputNumberField;