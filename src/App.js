import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useCallback, useEffect } from 'react';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { getProfile } from './services/getProfile';
import { useDispatch, useSelector } from 'react-redux';
import { setFullNameCurrentUser } from './redux/slices/fullNameCurrentUserSlice';
import { setCurrentUserImageSlice } from './redux/slices/currentUserImageSlice';
import { setInfoCurrentUser } from './redux/slices/infoCurrentUserSlice';
import { getCurrentUser } from './services/getCurrentUser';
import { setCurrentUser } from './redux/slices/currentUserSlice';
import { setProfile } from './redux/slices/profileSlice';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentUser.currentUser);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!user && token) {
            const fetchApi = async () => {
                const res = await getCurrentUser(token);
                try {
                    dispatch(setCurrentUser(res.data.nickname));
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        }
        if (user && token) {
            const fetchApi = async () => {
                const res = await getProfile(`@${user}`, token);
                try {
                    dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                    dispatch(
                        setInfoCurrentUser({
                            bio: `${res.bio}`,
                            followers: `${res.followers_count || '0'}`,
                            likes: `${res.likes_count}`,
                        }),
                    );
                    dispatch(setCurrentUserImageSlice(res.avatar));
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        }
    }, [dispatch, user]);

    useEffect(() => {
        console.log(
            '%cTikTok front-end clone built with Javascript, HTML, CSS modules, SASS, React, Redux Toolkit and copyright by Canhtv05',
            'color: rgb(3, 201, 169); font-size: 14px;',
        );
    }, []);

    const handlePopState = useCallback(() => {
        dispatch(setProfile({}));
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    return (
        <Router>
            <div className="App">
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
                            ></Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
