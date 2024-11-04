// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "../src/store/store"; 

const app = createApp(App);
app.use(router);
app.use(store); // Provide the Vuex store
app.mount("#app");
