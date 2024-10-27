import React from "react";

import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import PageContainer from "../components/common/PageContainer";
import ComingSoon from "../components/common/ComingSoon";

const HomePage = () => (
    <PageContainer title='accueil'>
        <ComingSoon/>
    </PageContainer>
);
export default HomePage;
