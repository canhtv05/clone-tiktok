import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { getProfile } from './services/getProfile';
import { useDispatch } from 'react-redux';
import { setFullNameCurrentUser } from './redux/slices/fullNameCurrentUserSlice';
import { setCurrentUserImageSlice } from './redux/slices/currentUserImageSlice';
import { setInfoCurrentUser } from './redux/slices/infoCurrentUserSlice';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (user && token) {
            const fetchApi = async () => {
                const res = await getProfile(`@${user}`);
                dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                dispatch(
                    setInfoCurrentUser({
                        bio: `${res.bio}`,
                        followers: `${res.followers_count || '0'}`,
                        likes: `${res.likes_count}`,
                    }),
                );
                dispatch(setCurrentUserImageSlice(res.avatar));
            };
            fetchApi();
        }
    }, [dispatch]);

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
