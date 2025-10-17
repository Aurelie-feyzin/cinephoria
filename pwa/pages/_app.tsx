'use client';

import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type {AppProps} from "next/app"
import {DehydratedState, QueryClient, QueryClientProvider} from "react-query"
import {CinemasProvider} from "../context/CinemaContext";
import {UserProvider} from "../context/UserContext";
import {useEffect, useState} from "react";

function MyApp({Component, pageProps}: AppProps<{ dehydratedState: DehydratedState }>) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        document.documentElement.lang = 'fr';
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <CinemasProvider>
                    <Layout dehydratedState={pageProps.dehydratedState}>
                        <Component {...pageProps} />
                    </Layout>
                </CinemasProvider>
            </UserProvider>
        </QueryClientProvider>
    )
}

export default MyApp
