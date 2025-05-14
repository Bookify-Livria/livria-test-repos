import { createWebHistory, createRouter } from 'vue-router';

import Home from '../public/pages/home.component.vue';
import Account from '../public/pages/account.component.vue';
import Communities from "../public/pages/communities.component.vue";
import Booksss from '../public/pages/genre-cardshow.component.vue';
import SingularBook from '../public/pages/book-page.component.vue';
import Recommendation from "../public/pages/recommendation.component.vue";
import Search from "../public/pages/search-component.vue";
import Login from "../public/pages/login-page.component.vue";
import Register from "../public/pages/register-page.component.vue";
import Purchase from "../public/pages/purchase.component.vue";
import SubscriptionComponent from "../public/pages/subscription.component.vue";
import CommunityView from '../public/pages/view-communities.component.vue';
import Shop from '../public/pages/shop.component.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: Login},
        {path: '/home', component: Home},
        {path: '/account', component: Account},
        {path: '/communities', component: Communities},
        {path: '/login', component: Login},
        {path: '/register', component: Register},
        {path: "/purchase", component: Purchase},
        {path: "/shop", component: Shop},
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
        },
        {
            path: '/recommendations',
            name: 'Recommendations',
            component: Recommendation
        },
        {
            path: '/books/:title',
            name: 'BookDetail',
            component: SingularBook
        },
        {
            path: '/search',
            name: 'BookSearch',
            component: Search
        },
        {
            path: '/subscription',
            name: 'CommunitySubscription',
            component: SubscriptionComponent
        },
        {
            path: '/communities/:name',
            name: 'CommunityView',
            component: CommunityView
        }
    ]
})


export default router;