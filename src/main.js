import { createApp } from 'vue'
import "./assets/styles/components/variables.css";
import "./assets/styles/components/fonts.css";
import './styles.css'
import App from './App.vue'
import i18n from "./i18n.js"

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Toolbar from "primevue/toolbar";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Card from 'primevue/card';
import Carousel from "primevue/carousel";
import SelectButton from "primevue/selectbutton";
import Password from "primevue/password";
import Image from "primevue/image";
import Message from "primevue/message";
import Drawer from "primevue/drawer";
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';

import router from "./router/index.js";

const app = createApp(App);

app
    .use(i18n)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .component("pv-button", Button)
    .component("pv-toolbar", Toolbar)
    .component("pv-icon-field", IconField)
    .component("pv-input-icon", InputIcon)
    .component("pv-input-text", InputText)
    .component("pv-card", Card)
    .component("pv-carousel", Carousel)
    .component("pv-select-button", SelectButton)
    .component("pv-password", Password)
    .component("pv-image", Image)
    .component("pv-message", Message)
    .component("pv-drawer", Drawer)
    .component("pv-toast", Toast);


app.mount("#app");