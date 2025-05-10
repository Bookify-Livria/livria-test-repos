import { createWebHistory, createRouter } from 'vue-router';

import Home from '../public/pages/home.component.vue';
import Account from '../public/pages/account.component.vue';
import Communities from "../public/pages/communities.component.vue";
import Booksss from '../public/pages/Bookcardshow.component.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: Home},
        {path: '/home', component: Home},
        {path: '/account', component: Account},
        {path: '/communities', component: Communities},
        {
            path: '/bookl',
            name: 'LiteratureBooks',
            component: Booksss,
            props: { genre: 'literatura' }
        },
        {
            path: '/booknf',
            name: 'NoFictionBooks',
            component: Booksss,
            props: { genre: 'noficcion' }
        },
        {
            path: '/bookf',
            name: 'FictionBooks',
            component: Booksss,
            props: { genre: 'ficcion' }
        },
        {
            path: '/bookmc',
            name: 'MangasycomicsBooks',
            component: Booksss,
            props: { genre: 'mangasycomics' }
        },
        {
            path: '/bookj',
            name: 'JuvenilBooks',
            component: Booksss,
            props: { genre: 'juvenil' }
        },
        {
            path: '/bookc',
            name: 'ChildrenBooks',
            component: Booksss,
            props: { genre: 'infantil' }
        },
        {
            path: '/bookea',
            name: 'EaBooks',
            component: Booksss,
            props: { genre: 'ebooks' }
        }
    ]
})


export default router;