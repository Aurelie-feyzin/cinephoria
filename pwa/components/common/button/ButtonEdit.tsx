import Link from "next/link";
import EditIcon from "../Icon/EditIcon";
import React from "react";


const ButtonEdit = ({href, disabled, fullWidth}: { href: string, disabled: boolean, fullWidth: boolean }) => (
    <button type="button" disabled={disabled}
            className={`${fullWidth ? "w-full" : "px-6 py-2"}  items-center text-center bg-primary text-white p-2 rounded hover:bg-secondary flex disabled:bg-gray-700`}>
        {disabled ?
            <>
                <EditIcon textColor="white"/>
                <span className="ml-2">Modifier</span>  </> :
            <Link href={href}
                  className="hover:bg-secondary flex items-center text-center text-white disabled:bg-gray-700 ${true ? 'pointer-events-none' : ''} disabled:bg-gray-700"
            >
                <EditIcon textColor="white"/>
                <span className="ml-2">Modifier</span>
            </Link>}
    </button>
)

export default ButtonEdit;