import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosList } from '~/services/videos/getVideosList';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';
import { setIndexPage, setReloadPage } from '~/redux/slices/pageSlice';
import { setIndexVideoHome } from '~/redux/slices/indexVideoHomeSlice';
import useLocalStorage from '~/hooks/useLocalStorage';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    const dispatch = useDispatch();
    const page = useMemo(() => Math.floor(Math.random() * 20) + 1, []);
    const [isEndedVideoList, setIsEndedVideoList] = useState([]);
    const [loadedPages, setLoadedPages] = useState(new Set());
    const [scrollToggle, setScrollToggle] = useState(false);

    const articleRefs = useRef([]);

    const [volume, setVolume] = useLocalStorage('volume', 50);

    const { indexPage: prevIndexPage, isReloadPage } = useSelector((state) => state.page);

    const listVideos = useSelector((state) => state.listVideosHome.listVideosHome);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);
    const [listVideo, setListVideo] = useState([]);

    const [maxIndexVideoHome, setMaxIndexVideoHome] = useState(indexVideoHome ?? 0);

    const token = localStorage.getItem('token');

    const fetchApi = useCallback(
        async (page) => {
            if (listVideos.length === 0) {
                loadedPages.clear();
            }

            if (!page || loadedPages.has(page)) return;
            try {
                const res = await getVideosList(page, true, token);
                const newVideos = res.data || [];
                dispatch(
                    setListsVideoHome([
                        ...listVideos,
                        ...newVideos.filter((video) => !listVideos.some((v) => v.id === video.id)),
                    ]),
                );
                setLoadedPages((prev) => new Set(prev).add(page));
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        },
        [dispatch, token, listVideos, loadedPages],
    );

    useEffect(() => {
        if (listVideos) {
            setListVideo(listVideos);
        }
    }, [listVideos]);

    useEffect(() => {
        if (!prevIndexPage) {
            dispatch(setIndexPage(page));
        }
    }, [page, dispatch, prevIndexPage]);

    useEffect(() => {
        if (listVideo.length === 0 && !scrollToggle) {
            fetchApi(page);
        }
    }, [page, fetchApi, listVideo, scrollToggle]);

    useEffect(() => {
        if (listVideos.length === 0 && !scrollToggle) {
            fetchApi(page);
        }
    }, [page, fetchApi, scrollToggle, listVideos]);

    useEffect(() => {
        if (listVideo.length > 0) {
            setIsEndedVideoList(new Array(listVideo.length).fill(false));
        }
    }, [listVideo]);

    // Gọi hàm cuộn đến chỉ mục 2
    const scrollToIndex = (index) => {
        if (articleRefs.current[index]) {
            articleRefs.current[index].scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (listVideo.length > 0) {
            if (indexVideoHome !== null) {
                scrollToIndex(indexVideoHome);
            }
        }
    }, [listVideo, indexVideoHome]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        dispatch(setIndexVideoHome(index));

                        if ((index + 1) % 15 === 0) {
                            const nextPage = Math.floor((index + 1) / 15) + page;
                            if (!loadedPages.has(nextPage)) {
                                fetchApi(nextPage);
                            }
                        }
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
    }, [listVideo, fetchApi, page, dispatch, indexVideoHome, prevIndexPage, loadedPages]);

    useEffect(() => {
        if (isReloadPage) {
            fetchApi(prevIndexPage);
            dispatch(setReloadPage(false));
        }
    }, [fetchApi, isReloadPage, prevIndexPage, dispatch]);

    useEffect(() => {
        if (isEndedVideoList[indexVideoHome] && scrollToggle) {
            const nextIndex = indexVideoHome + 1;

            if (nextIndex < listVideo.length) {
                dispatch(setIndexVideoHome(nextIndex));
                scrollToIndex(nextIndex);
                setIsEndedVideoList((prev) => [...prev, isEndedVideoList[indexVideoHome] === false]);
            }
        }
    }, [isEndedVideoList, scrollToggle, indexVideoHome, listVideo.length, dispatch]);

    useEffect(() => {
        if ((indexVideoHome + 1) % 15 === 0 && indexVideoHome >= maxIndexVideoHome) {
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
                    <div className={cx('column-list-container')}>
                        {Array.isArray(listVideo) &&
                            listVideo.map((data, index) => (
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
