import React from "react";
import Head from "next/head";
import NavBar from "./NavBar";

type Props = {
  title?: React.ReactNode
  children?: React.ReactNode
    titlePage?: string
};


const PageContainer: React.FC<Props> = ({title,titlePage,  children}) => {
  return (
      <div className="w-full overflow-x-hidden">
          <Head>
              <title>Cinephoria: {title}</title>
          </Head>
          <NavBar/>
          <div className="bg-primary">

              <div className="text-center text-white p-4 text-3xl">
                  <h1>{titlePage}</h1>
              </div>
              <div className="md:container md:mx-auto mx-auto">
                  {children}
              </div>

              <footer style={{textAlign: 'center'}}>
                  @todo
              </footer>
          </div>
      </div>
          );
          };

          export default PageContainer;
