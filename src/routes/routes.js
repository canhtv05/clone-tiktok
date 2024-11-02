import { HeaderOnly } from '~/layouts';
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Live from '~/pages/Live';
import Explore from '~/pages/Explore';
import config from '~/config';
import Video from '~/pages/Video';
import Message from '~/pages/Message';
import PageNotFound from '~/components/NotFound/PageNotFound';

// public Routes
const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.following,
        component: Following,
    },
    {
        path: config.routes.profile,
        component: Profile,
    },
    {
        path: config.routes.upload,
        component: Upload,
        layout: HeaderOnly,
    },
    {
        path: config.routes.search,
        component: Search,
    },
    {
        path: config.routes.live,
        component: Live,
    },
    {
        path: config.routes.explore,
        component: Explore,
    },
    {
        path: config.routes.video,
        component: Video,
    },
    {
        path: config.routes.messages,
        component: Message,
        // layout: HeaderOnly,
    },
    {
        path: '*',
        component: PageNotFound,
        layout: HeaderOnly,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
