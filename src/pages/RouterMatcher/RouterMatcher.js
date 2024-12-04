import { useLocation } from 'react-router-dom';
import Video from '~/pages/Video/Video';
import Message from '~/pages/Message/Message';

const RouteMatcher = () => {
    const location = useLocation();
    const videoPathMatch = location.pathname.match(/\/video\/([^/]+)/);
    const messagePathMatch = location.pathname === '/messages';

    if (videoPathMatch) {
        return <Video />;
    }

    if (messagePathMatch) {
        return <Message />;
    }

    return null;
};

export default RouteMatcher;
