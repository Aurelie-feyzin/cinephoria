import {HOST_PATH} from "./utils";
import {ForgotPasswordInput, ResetPasswordInput} from "../model/User";

const FORGOT_PASSWORD_PATH = 'forgot-password/'
export const fetchForgotPassword = async (data: ForgotPasswordInput) =>
{
    return   await fetch(`${HOST_PATH}${FORGOT_PASSWORD_PATH}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};

export const fetchResetPassword = async (data: ResetPasswordInput, token:string) =>
{
    return   await fetch(`${HOST_PATH}${FORGOT_PASSWORD_PATH}${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};