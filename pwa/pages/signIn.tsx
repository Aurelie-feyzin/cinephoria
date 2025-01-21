import React, {useEffect, useState} from "react";

import PageContainer from "../components/common/layout/PageContainer";
import RegistrationForm from "../components/security/RegistrationForm";
import AlertInfo from "../components/common/alert/AlertInfo";
import AlertError from "../components/common/alert/AlertError";
import LoginForm from "../components/security/LoginForm";


const Signin = () => {
    const [registrationForm, setRegistrationForm] = useState(false);
    const [registationOk, setRegistrationOk] = useState(false);
    const [registationKo, setRegistrationKo] = useState(false);

    return (
        <PageContainer title='se connecter'>
            <div className="items-center justify-center min-h-screen">
                <div className="max-w-md mb-4 mx-auto rounded-lg">
                    <AlertInfo visible={registationOk}
                               titleMessage='Compte crée avec succés'
                               message="Votre compte a bien été crée, vous allez recevoir un émail de confirmation d'inscription."
                    />
                    <AlertError visible={registationKo}
                                titleMessage='Erreur pendant la création du compte'
                                message="Une erreur c'est produite pendant la création du compte."
                    />
                </div>
                {!registrationForm  && <LoginForm setRegistrationForm={setRegistrationForm} />}
                {registrationForm  &&
                    <RegistrationForm setRegistrationOk={setRegistrationOk} setRegistrationKo={setRegistrationKo}
                                      setRegistrationForm={setRegistrationForm}/>}

            </div>
        </PageContainer>
    );
}
export default Signin;
