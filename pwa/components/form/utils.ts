export const REQUIRED = {required: 'Ce champ est obligatoire'}
export const customMaxLength = (maxValue = 255)=> (
    { maxLength: { value: maxValue, message: `Maximum ${maxValue} caractères.` } });

export const validatePassword = (password: string) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!uppercaseRegex.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre majuscule.";
    }
    if (!lowercaseRegex.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre minuscule.";
    }
    if (!numberRegex.test(password)) {
        return "Le mot de passe doit contenir au moins un chiffre.";
    }
    if (!specialCharRegex.test(password)) {
        return "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    return true;
};