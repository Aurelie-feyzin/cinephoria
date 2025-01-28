import React from "react";
import NavBarIntranet from "./Layout/NavBarIntranet";
import Sidebar from "./Layout/SideBarIntranet";
import Head from "next/head";

type PageContainerProps = {
    titlePage: string
    children?: React.ReactNode
    action?: React.ReactNode
};


const PageIntranetContainer: React.FC<PageContainerProps> = ({titlePage, children, action}) => {
    return (
        <>
            <Head>
                <title>Intranet Cinephoria</title>
            </Head>
            <div className="flex h-screen overflow-hidden">
                <Sidebar/>
                <main className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <NavBarIntranet/>
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

export default PageIntranetContainer;