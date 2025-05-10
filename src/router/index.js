import { createWebHistory, createRouter } from 'vue-router';

import Home from '../public/pages/home.component.vue';
import Account from '../public/pages/account.component.vue';
import Communities from "../public/pages/communities.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: Home},
        {path: '/home', component: Home},
        {path: '/account', component: Account},
        {path: '/communities', component: Communities},
    ]
})


export default router;