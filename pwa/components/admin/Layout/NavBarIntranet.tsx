import React from "react";
import {useUser} from "../../../context/UserContext";
import NavBarLink from "../../common/NavBarLink";
import LogoutIcon from "../../common/Icon/LogoutIcon";

const NavBarIntranet = () => {
    const {user, logout} = useUser();

    return (
        <header className="bg-primary text-white p-4 items-center">
            <div className="flex justify-end space-x-4">
                <NavBarLink href={'/intranet'}>Retour intranet</NavBarLink>
                <NavBarLink href={'/'}>Retour au site</NavBarLink>
                <p className="px-4 py-2 rounded-md shadow text-white hover:bg-secondary">
                    {user?.firstName}
                </p>
                <button
                    onClick={logout}
                    className="text-white hover:bg-secondary transition duration-200 p-2 rounded"
                >
                    <LogoutIcon/>
                </button>
            </div>
        </header>
    );
}

export default NavBarIntranet;
