import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosList } from '~/services/getVideosList';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';

    const dispatch = useDispatch();
    const page = Math.floor(Math.random() * 42) + 1;

    const listVideos = useSelector((state) => state.listVideosHome.listVideosHome);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);

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

    const articleRefs = useRef([]);

    // Gọi hàm cuộn đến chỉ mục 2
    const scrollToIndex = (index) => {
        if (articleRefs.current[index]) {
            articleRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
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
    }, [listVideos, fetchApi, page]);

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
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
