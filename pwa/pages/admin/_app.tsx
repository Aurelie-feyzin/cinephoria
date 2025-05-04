import "../../styles/globals.css"
import type {AppProps} from "next/app"
import {DehydratedState, QueryClient, QueryClientProvider} from "react-query"
import {useState} from "react";
import {UserProvider} from "../../context/UserContext";
import Layout from "../../components/common/Layout";

function AdminApp({Component, pageProps}: AppProps<{ dehydratedState: DehydratedState }>) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                    <Layout dehydratedState={pageProps.dehydratedState}>
                        <Component {...pageProps} />
                    </Layout>
            </UserProvider>
        </QueryClientProvider>
    )
}

export default AdminApp
