import React from "react";
import {LOGIN_FORM} from "../../pages/signIn";


const LinkLoginForm = ({setFormVisible}: { setFormVisible: any }) => (
    <p className="mb-4 text-center text-secondary">
        Déjà un compte :&nbsp;
        <a
            className="text-white underline"
            onClick={() => setFormVisible(LOGIN_FORM)}>connectez-vous</a>
    </p>
);

export default LinkLoginForm;