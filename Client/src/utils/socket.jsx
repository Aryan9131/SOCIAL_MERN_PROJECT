import io from 'socket.io-client'
let socket;
const connectSocket = (user_id) => {
    socket = io(process.env.VITE_BACKEND_URL, {
        query: { user_id: user_id }
    });
    console.log("Socket connected frontend!");
}

export {socket, connectSocket}