import { Route, Routes, useLocation } from 'react-router-dom';
import Video from '~/pages/Video/Video';
import Message from '~/pages/Message/Message';

const ModalMatcher = () => {
    const location = useLocation();
    const state = location.state;

    return (
        state?.background && (
            <Routes>
                <Route path="/video/:id" element={<Video />}></Route>
                <Route path="/messages" element={<Message />}></Route>
            </Routes>
        )
    );
};

export default ModalMatcher;
