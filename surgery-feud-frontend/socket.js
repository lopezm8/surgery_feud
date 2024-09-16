// socket.js
import io from 'socket.io-client';

const socket = io('https://surgery-feud-backend-790d5e52ce40.herokuapp.com', {
    transports: ['websocket', 'polling'],
});

export default socket;
