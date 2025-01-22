import React, {useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import RegistrationForm from "../components/security/RegistrationForm";
import LoginForm from "../components/security/LoginForm";
import ForgotPasswordForm from "../components/security/ForgotPasswordForm";

export const LOGIN_FORM = 'login';
export const REGISTRATION_FORM = 'registration';
export const FORGOT_FORM = 'forgot';
export const RESET_FORM = 'reset';
const Signin = () => {
    const [formVisible, setFormVisible] = useState(LOGIN_FORM);

    return (
        <PageContainer title='se connecter'>
            <div className="items-center justify-center min-h-screen">
                {formVisible === LOGIN_FORM && <LoginForm setFormVisible={setFormVisible} />}
                {formVisible === REGISTRATION_FORM && <RegistrationForm setFormVisible={setFormVisible} />}
                {formVisible === FORGOT_FORM && <ForgotPasswordForm setFormVisible={setFormVisible} />}

            </div>
        </PageContainer>
    );
}
export default Signin;
