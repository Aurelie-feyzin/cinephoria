import React, {useState} from "react";
import Image from "next/image";
import logo from "../../../public/images/logo_cinephoria.png";
import SideBarLink from "../../intranet/Layout/SideBarLink";
import {useQuery} from "react-query";
import {ApiResponse} from "../../../model/ApiResponseType";
import {MinimalSeat} from "../../../model/Seat";
import {fetchSeatsByMovieTheater} from "../../../request/seat";
import {addFixtures} from "../../../request/fixture";


const Sidebar = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const runFixtures = async () => {
        setResult(null);
        setLoading(true);
            addFixtures()
                .then((data) =>  setResult(data?.status || 'Terminé'))
                .catch(() => setResult('Erreur lors de l’exécution'))
                .finally(() => setLoading(false))
            ;
    };

    return (
            <aside
                className="p-4 absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 -translate-x-full"
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
                                <li key="movies"><SideBarLink href="/admin">Accueil</SideBarLink></li>
                                <li key="seances"><SideBarLink href="/admin/employees">Employés</SideBarLink></li>
                                <hr />
                                <button
                                    onClick={runFixtures}
                                    disabled={loading}
                                    className="w-full bg-primary text-white p-2 rounded hover:bg-secondary flex"
                                >
                                    {loading ? 'Chargement...' : 'Exécuter les fixtures'}
                                </button>
                            </ul>
                        {result && <pre className="mt-4 bg-gray-100 p-3 rounded">{result}</pre>}
                    </nav>
                </div>
            </aside>
    );
};

export default Sidebar;