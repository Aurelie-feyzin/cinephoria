import React from "react";


const PropertyInline = ({label, value}: {label:string, value?:string})=> (
    <p className="text text-gray-700">
        <span className="font-semibold">{label}:</span> {value}
    </p>
)

export default PropertyInline