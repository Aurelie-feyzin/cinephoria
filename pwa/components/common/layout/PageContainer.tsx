import React from "react";
import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";
import {useCinemas} from "../../../context/CinemaContext";

type PageContainerProps = {
    title?: React.ReactNode
    children?: React.ReactNode
    titlePage?: string
};


const PageContainer: React.FC<PageContainerProps> = ({title, titlePage, children}) => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Cinephoria: {title}</title>
            </Head>
            <NavBar/>
            <div className="bg-primary flex flex-col min-h-screen">
                <div className="text-center text-white p-4 text-3xl">
                    <h1>{titlePage}</h1>
                </div>
                <div className="md:container md:mx-auto mx-auto pb-4 flex flex-col flex-grow">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default PageContainer;
