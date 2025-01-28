import React from "react";
import Image from "next/image";
import logo from "../../../public/images/logo_cinephoria.png";
import SideBarLink from "./SideBarLink";


const Sidebar = () => {

    return (
            <aside
                className="p-4 absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 -translate-x-full"
            >
                {/* <!-- SIDEBAR HEADER --> */}
                <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 text-white">
                    <Image
                        alt="logo cinephoria"
                        src={logo}
                        width={50}
                        height={50}
                    />
                    <span className="text-xl font-bold">Cinephoria</span>
                </div>
                {/* <!-- SIDEBAR HEADER --> */}

                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    {/* <!-- Sidebar Menu --> */}
                    <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6 mb-4">
                            <ul>
                                <li key="movies"><SideBarLink href="/intranet">Films</SideBarLink></li>
                                <li key="seances"><SideBarLink href="/intranet/film_shows">Séances</SideBarLink></li>
                                <li key="rooms"><SideBarLink href="/intranet/movie_theaters">Salles</SideBarLink></li>
                                <li key="avis"><SideBarLink href="/intranet/reviews">Avis</SideBarLink></li>
                            </ul>
                    </nav>
                </div>
            </aside>
    );
};

export default Sidebar;