import React from "react";


const InputTimeField = ({name, label, register, error, className, minValue, maxValue}:
                        {
                            register: any,
                            name: string,
                            label: string,
                            error: string | undefined,
                            className?: string
                            minValue?: string
                            maxValue?: string
                        }) => (
    <div className={`${className} mb-4`}>
        <label className="block text-white" htmlFor={name}>{label}</label>
        <input
            {...register}
            type='time'
            className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded"
            minValue={minValue}
            maxvalue={maxValue}
        />
        {minValue && <p role="complementary" className="block text-white text-sm mt-1">Heure minimun: {minValue}</p>}
        {maxValue && <p role="complementary" className="block text-white text-sm mt-1">Heure maximal: {maxValue}</p>}
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)

export default InputTimeField;