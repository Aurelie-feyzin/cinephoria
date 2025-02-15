'use client'
import React from "react";
import Image from "next/image";
import logo from "../../public/logo_cinephoria.png";
import Head from "next/head";
import {useUser} from "@/app/context/UserContext";
import Link from "next/link";
import LogoutIcon from "@/app/ui/Icon/LogoutIcon";

type PageContainerProps = {
    titlePage: string
    children?: React.ReactNode
    action?: React.ReactNode
};


const PageContainer: React.FC<PageContainerProps> = ({titlePage, children, action}) => {
    const {user, logout} = useUser();

    return (
        <>
            <Head>
                <title>Cinephoria Bureautique</title>
            </Head>
            <div className="flex h-screen overflow-hidden">
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
                                <li key="installations">
                                <Link href="/installations" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium  text-white  hover:bg-secondary">
                                Installations
                                </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>
                <main className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <header className="bg-black text-white p-4 items-center">
                        <div className="flex justify-end space-x-4">
                            <p className="px-4 py-2 rounded-md shadow text-white hover:bg-secondary">
                                {user?.firstName}
                            </p>
                            <button
                                onClick={logout}
                                className="text-white hover:bg-secondary transition duration-200 p-2 rounded"
                            >
                                <LogoutIcon />
                            </button>
                        </div>
                    </header>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1 text-center text-black p-4 text-3xl">
                            <h1>{titlePage}</h1>
                        </div>
                        <div className="ml-auto pr-4">
                            {action}
                        </div>
                    </div>
                    <div className="w-full p-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default PageContainer;