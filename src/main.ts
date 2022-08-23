import { createApp } from 'vue'
import App from './App.vue'
import echarts from "./utils/loadBarchart";
const app = createApp(App);

app.provide('$echarts',echarts);
app.mount('#app');

