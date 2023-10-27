import { io } from 'socket.io-client';

const URL = `${import.meta.env.VITE_SERVER_HOST}:${
  import.meta.env.VITE_SERVER_PORT
}`;
const socket = io(URL, { autoConnect: false });

export default socket;
