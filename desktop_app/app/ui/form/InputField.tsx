import React from "react";


const InputField = ({type = 'text', name, label, register, error, className}:
                    { register: any, type?: string, name: string, label: string, error: string | undefined, className?: string }) => (
    <div className={`${className} mb-4`}>
        <label className="block text-white" htmlFor={name}>{label}</label>
        <input
            {...register}
            type={type}
            className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded"
            onChange={(e) => {
                register.onChange(e);
                if (type==='date') {
                    e.target.blur(); // force close native datepicker
            }}}
        />
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)

export default InputField;