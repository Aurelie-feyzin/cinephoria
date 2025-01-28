import Link from "next/link";
import EditIcon from "../Icon/EditIcon";
import React from "react";


const ButtonEdit = ({href}: { href: string }) => (
    <button type="button" className="w-full bg-primary text-white p-2 rounded hover:bg-secondary flex">
        <Link href={href}
              className="hover:bg-secondary flex text-white">
            <EditIcon textColor="white"/>
            Modifier
        </Link>
    </button>
)

export default ButtonEdit;