import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import io from 'socket.io-client';

// Configure Socket.io connection
const socket = io('http://localhost:3000', {
  transports: ['websocket'],  // Only use WebSocket, disable polling
});

// Log connection and errors
socket.on('connect', () => {
  console.log('Connected to Socket.io server via WebSocket');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Create the Vue app and make socket globally available
const app = createApp(App);
app.config.globalProperties.$socket = socket;

app.use(router);
app.mount('#app');
