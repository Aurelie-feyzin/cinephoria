import React from "react";
import Head from "next/head";
import NavBar from "./NavBar";

type Props = {
  title?: React.ReactNode
  children?: React.ReactNode
};


const PageContainer: React.FC<Props> = ({title, children}) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Head>
        <title>Cinephoria: {title}</title>
      </Head>
      <div>
        <NavBar/>
        {children}
        <footer style={{textAlign: 'center'}}>
          @todo
        </footer>
      </div>
    </div>
  );
};

export default PageContainer;
