import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next';
import './style.css'
import { bootstrapConfig } from '@oruga-ui/theme-bootstrap';
import Swal from 'sweetalert2'

import '@oruga-ui/theme-bootstrap/dist/bootstrap.css';
import '@mdi/font/css/materialdesignicons.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap"

import VueApexCharts from "vue3-apexcharts";

const app = createApp(App)

//sweetalter
app.config.globalProperties.$swal = Swal

app.use(router).use(Oruga, bootstrapConfig).use(VueApexCharts)

app.mount('#app')
