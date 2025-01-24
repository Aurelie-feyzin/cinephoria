import React from "react";
import {FORGOT_FORM} from "../../pages/signIn";


const LinkForgotPasswordForm = ({setFormVisible}: { setFormVisible: any }) => (
    <p className="mb-4 text-center text-secondary">
        <a onClick={() => setFormVisible(FORGOT_FORM)}>Mot de passe oublié</a>
    </p>
);

export default LinkForgotPasswordForm;