import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // If you're using Vue Router
import { createPinia } from 'pinia';
import './assets/main.css'; // Tailwind or custom CSS

const app = createApp(App);

app.use(router); // Optional: if you're using Vue Router
app.use(createPinia()); // Optional: if you're using Pinia for state management

app.mount('#app');

