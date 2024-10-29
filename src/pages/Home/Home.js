import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosList } from '~/services/getVideosList';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    const dispatch = useDispatch();
    const page = Math.floor(Math.random() * 42) + 1;

    const listVideos = useSelector((state) => state.listVideosHome.listVideosHome);

    const fetchApi = useCallback(
        async (page) => {
            try {
                const res = await getVideosList(page, true);
                dispatch(setListsVideoHome(res.data));
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch],
    );

    useEffect(() => {
        if (listVideos.length === 0) {
            fetchApi(page);
        }
    }, [page, fetchApi, listVideos]);

    const handleScrollLoadPage = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            fetchApi(page + 1);
        }
    }, [page, fetchApi]);

    useEffect(() => {
        document.addEventListener('scroll', handleScrollLoadPage);
        return () => document.removeEventListener('scroll', handleScrollLoadPage);
    }, [handleScrollLoadPage]);

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('column-container')}>
                    <div className={cx('colum-list-container')}>
                        {listVideos.map((data, index) => (
                            <Article key={index} data={data} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
