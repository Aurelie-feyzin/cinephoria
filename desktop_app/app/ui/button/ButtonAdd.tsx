import React from "react";
import AddIcon from "../Icon/AddIcon";
import Link from "next/link";


const ButtonAdd = ({label, href}: { label: string, href: string }) => (
    <button type="button" className="w-full bg-primary text-white p-2 rounded hover:bg-secondary flex">
        <Link href={href} className="hover:bg-secondary flex text-white">
            <AddIcon/>
            {label}
        </Link>
    </button>
);

export default ButtonAdd;