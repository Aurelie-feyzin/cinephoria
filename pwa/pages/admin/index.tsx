import type {NextPage} from "next";
import React from "react";
import PageAdminContainer from "../../components/admin/PageAdminContainer";
import ComingSoon from "../../components/common/ComingSoon";


const Admin: NextPage = () => {
    return <PageAdminContainer titlePage="Accueil">
        <ComingSoon/>
    </PageAdminContainer>
}

export default Admin;
