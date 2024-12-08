import { Routes, Route, useLocation } from 'react-router-dom';
import { Fragment, useCallback, useEffect } from 'react';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { useDispatch } from 'react-redux';
import { setProfile } from './redux/slices/profileSlice';
import useCheckToken from './hooks/useCheckToken';
import { setReloadPage } from './redux/slices/pageSlice';
import useFetchUserData from './hooks/useFetchUserData';
import ModalMatcher from './pages/ModalMatcher/ModalMatcher';

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const state = location.state;

    useEffect(() => {
        console.log(
            '%cTikTok front-end clone built with Javascript, HTML, CSS modules, SASS, React, Redux Toolkit and copyright by Canhtv05',
            'color: rgb(3, 201, 169); font-size: 14px;',
        );
    }, []);

    useFetchUserData();

    useCheckToken();

    const handlePopState = useCallback(() => {
        dispatch(setProfile({}));
        dispatch(setReloadPage(true));
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    return (
        <div className="App" style={{ position: 'relative', zIndex: 1 }}>
            <Routes location={state?.background || location}>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;

                    let Layout = DefaultLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>

            <ModalMatcher />
        </div>
    );
}

export default App;
