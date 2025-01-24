import { ReactNode } from "react";
import {
  DehydratedState,
  Hydrate,
} from "react-query";

const Layout = ({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState: DehydratedState;
}) => {


  return (
      <Hydrate state={dehydratedState}>{children}</Hydrate>
  );
};

export default Layout;
