import React from "react";
import {REGISTRATION_FORM} from "../../pages/signIn";


const LinkRegisterForm = ({setFormVisible}: { setFormVisible: any }) => (
    <p className="mb-4 text-center text-secondary">
        Pas encore de compte :&nbsp;
        <a
            className="text-white underline"
            onClick={() => setFormVisible(REGISTRATION_FORM)}>inscrivez-vous</a>
    </p>
);

export default LinkRegisterForm;