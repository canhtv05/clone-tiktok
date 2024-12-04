import { Routes, Route } from 'react-router-dom';
import { Fragment, useCallback, useEffect } from 'react';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { useDispatch } from 'react-redux';
import { setProfile } from './redux/slices/profileSlice';
import useCheckToken from './hooks/useCheckToken';
import { setReloadPage } from './redux/slices/pageSlice';
import useFetchUserData from './hooks/useFetchUserData';
import RouteMatcher from './pages/RouterMatcher/RouterMatcher';

function App() {
    const dispatch = useDispatch();

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
            <RouteMatcher />
            <Routes>
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
        </div>
    );
}

export default App;
