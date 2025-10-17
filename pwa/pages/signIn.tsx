'use client';

import React, {useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import RegistrationForm from "../components/security/RegistrationForm";
import LoginForm from "../components/security/LoginForm";
import ForgotPasswordForm from "../components/security/ForgotPasswordForm";

export const LOGIN_FORM = {
    id: 'login',
    title: 'Se connecter',
};
export const REGISTRATION_FORM = {
    id: 'registration',
    title: 'Créer un compte',
};
export const FORGOT_FORM = {
        id: 'forgot',
        title: 'Mot de passe oublié',
    };
const Signin = () => {
    const [formVisible, setFormVisible] = useState(LOGIN_FORM);

    return (
        <PageContainer title='se connecter' titlePage={formVisible.title}>
            <div className="items-center justify-center min-h-screen">
                {formVisible === LOGIN_FORM && <LoginForm setFormVisible={setFormVisible} />}
                {formVisible === REGISTRATION_FORM && <RegistrationForm setFormVisible={setFormVisible} />}
                {formVisible === FORGOT_FORM && <ForgotPasswordForm setFormVisible={setFormVisible} />}
            </div>
        </PageContainer>
    );
}
export default Signin;
