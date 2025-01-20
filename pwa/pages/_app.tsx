import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type {AppProps} from "next/app"
import type {DehydratedState} from "react-query"
import {CinemasProvider} from "../context/CinemaContext";
import {UserProvider} from "../context/UserContext";

function MyApp({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) {
  return (
      <UserProvider>
        <CinemasProvider>
            <Layout dehydratedState={pageProps.dehydratedState}>
                <Component {...pageProps} />
            </Layout>
        </CinemasProvider>
      </UserProvider>
    )
}

export default MyApp
