import React from "react";


const ButtonSubmit = ({label = "Enregistrer"}:{label?: string} ) => (
    <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-secondary">
        {label}
    </button>
);

export default ButtonSubmit;