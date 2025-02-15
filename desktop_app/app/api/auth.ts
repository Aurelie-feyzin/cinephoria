type LoginInput = {
    username: string;
    password: string;
}

export const fetchGetToken = async (data: LoginInput) =>
{
 return   await fetch(`${process.env.NEXT_PUBLIC_API_PATH}auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};