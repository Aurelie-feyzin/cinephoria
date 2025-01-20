import {API_PATH} from "./utils";
export const fetchGetToken = async (data: LoginInput) =>
{
 return   await fetch(`${API_PATH}auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};