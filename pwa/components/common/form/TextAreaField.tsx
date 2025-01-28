import React from "react";

const TextAreaField = ({
                           name,
                           label,
                           register,
                           error,
                           placeholder = "Écrivez votre message, vos questions ou vos commentaires ici..."
                       }:
                       {
                           register: any,
                           type?: string,
                           name: string,
                           label: string,
                           error: string | undefined,
                           placeholder?: string
                       }) => (
    <div className="mb-4 ">
        <label className="block text-white" htmlFor={name}>{label}</label>
        <textarea
            {...register}
            id={name}
            rows={4}
            className="mt-1 block w-full border text-primary border-gray-300 p-2 rounded"
            placeholder={placeholder}></textarea>
        <p role="alert" className="block text-white text-sm">{error}</p>
    </div>
)

export default TextAreaField;