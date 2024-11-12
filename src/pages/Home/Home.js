import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosList } from '~/services/getVideosList';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';
import { setIndexPage, setReloadPage } from '~/redux/slices/pageSlice';
import { setIndexVideoHome } from '~/redux/slices/indexVideoHomeSlice';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    const dispatch = useDispatch();
    const page = useMemo(() => Math.floor(Math.random() * 42) + 1, []);
    const [isEndedVideo, setIsEndedVideo] = useState([]);
    const [scrollToggle, setScrollToggle] = useState(false);

    const volumeRef = useRef();
    const articleRefs = useRef([]);

    const [volume, setVolume] = useState(50);
    const [previousVolume, setPreviousVolume] = useState(50);

    const { indexPage: prevIndexPage, isReloadPage } = useSelector((state) => state.page);

    const listVideos = useSelector((state) => state.listVideosHome.listVideosHome);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);

    const token = localStorage.getItem('token');

    const fetchApi = useCallback(
        async (page) => {
            if (page === null) return;
            try {
                const res = await getVideosList(page, true, token);

                dispatch(setListsVideoHome(res.data));
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch, token],
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
    }, [page, fetchApi, listVideos, dispatch, scrollToggle]);

    useEffect(() => {
        if (listVideos.length > 0) {
            setIsEndedVideo(new Array(listVideos.length).fill(false));
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
                console.log('index video home', indexVideoHome);
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
                        dispatch(setIndexVideoHome(index));
                        console.log('scroll toi ' + index);
                        if (index === 12) {
                            console.log('index ' + index);
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
    }, [listVideos, fetchApi, page, dispatch]);

    useEffect(() => {
        if (isReloadPage) {
            fetchApi(prevIndexPage);
            dispatch(setReloadPage(false));
        }
    }, [fetchApi, isReloadPage, prevIndexPage, dispatch]);

    useEffect(() => {
        if (isEndedVideo[indexVideoHome] && scrollToggle) {
            const nextIndex = indexVideoHome + 1;

            if (nextIndex < listVideos.length) {
                dispatch(setIndexVideoHome(nextIndex));
                scrollToIndex(nextIndex);
                setIsEndedVideo((prev) => ({ ...prev, [indexVideoHome]: false }));
            }
        }
    }, [isEndedVideo, scrollToggle, indexVideoHome, listVideos.length, dispatch]);

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('column-container')}>
                    <div className={cx('colum-list-container')}>
                        {listVideos.map((data, index) => (
                            <Article
                                key={index}
                                data={data}
                                ref={(element) => (articleRefs.current[index] = element)}
                                dataIndex={index}
                                isEndedVideo={isEndedVideo[index]}
                                setScrollToggle={setScrollToggle}
                                setIsEndedVideo={(ended) =>
                                    setIsEndedVideo((prev) => {
                                        const newArray = [...prev];
                                        newArray[index] = ended;
                                        return newArray;
                                    })
                                }
                                scrollToggle={scrollToggle}
                                previousVolume={previousVolume}
                                setPreviousVolume={setPreviousVolume}
                                volume={volume}
                                setVolume={setVolume}
                                volumeRef={volumeRef}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
