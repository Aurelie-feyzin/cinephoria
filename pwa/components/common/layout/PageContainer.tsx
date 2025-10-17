import React from "react";
import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";

type PageContainerProps = {
    title?: React.ReactNode
    children?: React.ReactNode
    titlePage?: string
    metaDescription?: string
};


const PageContainer: React.FC<PageContainerProps> = ({title, titlePage, children, metaDescription}) => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Cinephoria: {title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
            </Head>
            <NavBar/>
            <div className="bg-primary flex flex-col min-h-screen">
                <header className="text-center text-white p-4 text-3xl">
                    <h1>{titlePage}</h1>
                </header>
                <main className="md:container md:mx-auto mx-auto pb-4 flex flex-col flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default PageContainer;
