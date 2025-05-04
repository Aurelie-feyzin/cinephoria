import "../../styles/globals.css"
import type {AppProps} from "next/app"
import {DehydratedState, QueryClient, QueryClientProvider} from "react-query"
import {useState} from "react";
import {UserProvider} from "../../context/UserContext";
import {CinemasProvider} from "../../context/CinemaContext";
import Layout from "../../components/common/Layout";

function MyApp({Component, pageProps}: AppProps<{ dehydratedState: DehydratedState }>) {
    const [queryClient] = useState(() => new QueryClient());
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
