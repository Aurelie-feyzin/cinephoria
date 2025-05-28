'use client';

import PageContainer from "../components/common/layout/PageContainer";
import BanIcon from "../components/common/Icon/BanIcon";
import React from "react";

const Forbidden = () => {
    return (
        <PageContainer title='unauthorised'>
            <div className="flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold text-red-600">403 - Accès interdit</h1>
                <div className="text-lg mt-4 inline-flex flex-col md:flex-row items-center text-white text-left md:text-center">
                    <div className="mb-2 md:mb-0 md:mr-2">
                        <BanIcon />
                    </div>
                    <span>
                        Vous n’avez pas les autorisations nécessaires pour accéder à cette page.
                    </span>
                </div>
            </div>
        </PageContainer>
    );
}

export default Forbidden;