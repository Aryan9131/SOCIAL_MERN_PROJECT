
export const signUpUser = async (data) => {
  
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/create-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const signInUser = async (data) => {
    console.log("import.meta.env.VITE_BASE_URL --> "+import.meta.env.VITE_BASE_URL);
    console.log("data --> "+JSON.stringify(data))
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/create-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
