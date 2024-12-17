import { Route, Routes, useLocation } from 'react-router-dom';
import Video from '~/pages/Video/Video';
import Message from '~/pages/Message/Message';
import UploadWithProvider from '../Upload/UploadContext/UploadWithProvider';

const ModalMatcher = () => {
    const location = useLocation();
    const state = location.state;

    if (!state?.background) {
        return null;
    }

    return (
        state?.background && (
            <Routes>
                <Route path="/video/:id" element={<Video />}></Route>
                <Route path="/messages" element={<Message />}></Route>
                <Route path="/upload" element={<UploadWithProvider />}></Route>
            </Routes>
        )
    );
};

export default ModalMatcher;
