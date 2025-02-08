import {HOST_PATH} from "./utils";


export const newContact= (data: ContactInput): Promise<Response> => fetch(`${HOST_PATH}contact`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/ld+json',
    },
    body: JSON.stringify(data),
});