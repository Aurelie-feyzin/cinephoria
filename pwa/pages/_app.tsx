import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type { AppProps } from "next/app"
import type { DehydratedState } from "react-query"
import {CinemasProvider} from "../context/CinemaContext";

function MyApp({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) {
  return (
      <CinemasProvider>
  <Layout dehydratedState={pageProps.dehydratedState}>
    <Component {...pageProps} />
  </Layout>
      </CinemasProvider>
  )
}

export default MyApp
