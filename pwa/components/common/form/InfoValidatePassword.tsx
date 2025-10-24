import React from "react";

const InfoValidatePassword = () => (
    <div className="mb-4 ">
        <ul className="mt-2 text-sm text-gray-400">
            <li className="flex items-center">
                <span className="mr-2">•</span> Minimum 8 caractères
            </li>
            <li className="flex items-center">
                <span className="mr-2">•</span> Au moins 1 lettre majuscule
            </li>
            <li className="flex items-center">
                <span className="mr-2">•</span> Au moins 1 lettre minuscule
            </li>
            <li className="flex items-center">
                <span className="mr-2">•</span> Au moins 1 nombre
            </li>
            <li className="flex items-center">
                <span className="mr-2">•</span> Au moins 1 caractère spécial
            </li>
        </ul>
    </div>
)

export default InfoValidatePassword;