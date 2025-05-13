import {ContactInput} from "../model/Contact";


export const newContact= (data: ContactInput): Promise<Response> => fetch(`/contact`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/ld+json',
    },
    body: JSON.stringify(data),
});