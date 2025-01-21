import {API_PATH} from "./utils";

export const createUser= (data: UserInput): Promise<Response> => fetch(`${API_PATH }users`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/ld+json',
    },
    body: JSON.stringify(data)
});