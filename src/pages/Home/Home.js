import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getVideosList } from '~/services/getVideosList';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    // const dispatch = useDispatch();
    const page = Math.floor(Math.random() * 42) + 1;
    const [listVideo, setListVideo] = useState([]);
    const [countLoad, setCountLoad] = useState(1);

    const fetchApi = useCallback(
        async (page) => {
            if (countLoad < 2) {
                try {
                    const res = await getVideosList(page, true);
                    // dispatch(setListFollowingNotLoginSlice(res.data));
                    setListVideo(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        [countLoad],
    );

    useEffect(() => {
        if (listVideo.length === 0) {
            fetchApi(page);
        }
    }, [page, fetchApi, listVideo]);

    const handleScrollLoadPage = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 10 && countLoad < 2 && listVideo.length !== 30) {
            setCountLoad((prev) => prev + 1);
            fetchApi(page + 1);
        }
    }, [countLoad, page, fetchApi, listVideo]);

    useEffect(() => {
        document.addEventListener('scroll', handleScrollLoadPage);
        return () => document.removeEventListener('scroll', handleScrollLoadPage);
    }, [handleScrollLoadPage]);

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('column-container')}>
                    <div className={cx('colum-list-container')}>
                        {listVideo.map((data, index) => (
                            <Article key={index} data={data} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
