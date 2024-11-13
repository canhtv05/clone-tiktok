import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosList } from '~/services/getVideosList';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';
import { setIndexPage, setReloadPage } from '~/redux/slices/pageSlice';
import { setIndexVideoHome } from '~/redux/slices/indexVideoHomeSlice';
import useLocalStorage from '~/hooks/useLocalStorage';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    const dispatch = useDispatch();
    const page = useMemo(() => Math.floor(Math.random() * 42) + 1, []);
    const [isEndedVideoList, setIsEndedVideoList] = useState([]);
    const [scrollToggle, setScrollToggle] = useState(false);

    const articleRefs = useRef([]);

    const [volume, setVolume] = useLocalStorage('volume', 50);

    const { indexPage: prevIndexPage, isReloadPage } = useSelector((state) => state.page);

    const listVideos = useSelector((state) => state.listVideosHome.listVideosHome);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);

    const [maxIndexVideoHome, setMaxIndexVideoHome] = useState(indexVideoHome ?? 0);

    const token = localStorage.getItem('token');

    const fetchApi = useCallback(
        async (page) => {
            if (page === null) return;
            try {
                const res = await getVideosList(page, true, token);
                const newListVideosHome = [...listVideos, ...(res.data || [])];
                dispatch(setListsVideoHome(newListVideosHome));
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch, token, listVideos],
    );

    useEffect(() => {
        if (!prevIndexPage) {
            dispatch(setIndexPage(page));
        }
    }, [page, dispatch, prevIndexPage]);

    useEffect(() => {
        if (listVideos.length === 0 && !scrollToggle) {
            fetchApi(page);
        }
    }, [page, fetchApi, listVideos.length, scrollToggle]);

    useEffect(() => {
        if (listVideos.length > 0) {
            setIsEndedVideoList(new Array(listVideos.length).fill(false));
        }
    }, [listVideos]);

    // Gọi hàm cuộn đến chỉ mục 2
    const scrollToIndex = (index) => {
        if (articleRefs.current[index]) {
            articleRefs.current[index].scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (listVideos.length > 0) {
            if (indexVideoHome !== null) {
                scrollToIndex(indexVideoHome);
            }
        }
    }, [listVideos, indexVideoHome]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        console.log(index);
                        dispatch(setIndexVideoHome(index));
                    }
                });
            },
            { threshold: 1.0 },
        );

        articleRefs.current.forEach((article) => {
            if (article) {
                observer.observe(article);
            }
        });

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            articleRefs.current.forEach((article) => {
                if (article) {
                    observer.unobserve(article);
                }
            });
        };
    }, [listVideos, fetchApi, page, dispatch, indexVideoHome, prevIndexPage]);

    useEffect(() => {
        if (isReloadPage) {
            fetchApi(prevIndexPage);
            dispatch(setReloadPage(false));
        }
    }, [fetchApi, isReloadPage, prevIndexPage, dispatch]);

    useEffect(() => {
        if (isEndedVideoList[indexVideoHome] && scrollToggle) {
            const nextIndex = indexVideoHome + 1;

            if (nextIndex < listVideos.length) {
                dispatch(setIndexVideoHome(nextIndex));
                scrollToIndex(nextIndex);
                setIsEndedVideoList((prev) => [...prev, isEndedVideoList[indexVideoHome] === false]);
            }
        }
    }, [isEndedVideoList, scrollToggle, indexVideoHome, listVideos.length, dispatch]);

    useEffect(() => {
        if ((indexVideoHome + 1) % 15 === 0 && indexVideoHome > maxIndexVideoHome) {
            const newPage = page + 1;
            setIndexPage(newPage);
            setMaxIndexVideoHome(indexVideoHome);
            fetchApi(newPage);
        }
    }, [indexVideoHome, fetchApi, page, maxIndexVideoHome]);

    const handleEndedVideo = (index, value) => {
        setIsEndedVideoList((prev) => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
    };

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('column-container')}>
                    <div className={cx('colum-list-container')}>
                        {Array.isArray(listVideos) &&
                            listVideos.map((data, index) => (
                                <Article
                                    key={index}
                                    data={data}
                                    ref={(element) => (articleRefs.current[index] = element)}
                                    dataIndex={index}
                                    isEndedVideo={isEndedVideoList[index]}
                                    setScrollToggle={setScrollToggle}
                                    setIsEndedVideo={(ended) => handleEndedVideo(index, ended)}
                                    scrollToggle={scrollToggle}
                                    setVolume={setVolume}
                                    volume={volume}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
