import React from "react";
import AddIcon from "../Icon/AddIcon";
import Link from "next/link";


const ButtonAdd = ({label, href, onClick}: {label: string, href?: string, onClick?: any}        ) => (
    <button type="button"
            className="w-full bg-primary text-white p-2 rounded hover:bg-secondary flex"
            onClick={onClick}
    >
        {href ?
        <Link href={href} className="hover:bg-secondary flex text-white">
            <AddIcon />
            {label}
        </Link>
            :  <>
                <AddIcon />
                {label}
            </>
        }
    </button>
);

export default ButtonAdd;