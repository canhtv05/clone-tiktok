import { createRef, memo, useContext, useCallback, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Content.module.scss';
import Button from '~/components/Button';
import { FavoritesIcon, LockIcon, NoVideoIcon, PauseIcon, PrivateIcon } from '~/components/Icons';
import NotFoundActive from '~/components/NotFound/NotFoundActive';
import SvgIcon from '~/components/Icons/SvgIcon';
import { getVideosById } from '~/services/getVideosById';
import listVideos from '~/assets/videos';
import images from '~/assets/images';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setIndexVideo } from '~/redux/slices/indexVideoSlice';
import { setListVideos } from '~/redux/slices/listVideoSlice';
import LoginModal from '~/components/LoginForm';
import { setPreviousLocation } from '~/redux/slices/previousLocationSlice';

const cx = classNames.bind(styles);

const loadingVideoItem = new Array(10).fill(1);

function Content({ isLoading }) {
    const data = useSelector((state) => state.profile.data);

    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const myProfile = useSelector((state) => state.myAccount.myAccount);
    const user = useSelector((state) => state.currentUser.currentUser);

    const [videos, setVideos] = useState({ data: [] });
    const [isVideos, setIsVideos] = useState(true);
    const [listRefVideo, setListRefVideo] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [typeMenu, setTypeMenu] = useState('videos');
    const location = useLocation();

    const themeContext = useContext(ThemeContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if ((!data || Object.keys(data).length === 0) && isLoading) return;
    }, [data, isLoading]);

    // Tải video theo id
    useEffect(() => {
        const fetchApi = async () => {
            if (!data?.id) return;

            const res = await getVideosById(data?.id);
            setVideos(res);
            dispatch(setListVideos(res.data));
            setIsVideos(res.data.length > 0);
        };

        if (data?.id && !isLoading) {
            fetchApi();
        }
    }, [data?.id, isLoading, dispatch]);

    // Đặt lại video và danh sách ref khi đang tải
    useEffect(() => {
        if (isLoading) {
            setVideos({ data: [] });
            setListRefVideo([]);
        }
        setIsVideos(true);
    }, [isLoading]);

    // Tạo danh sách ref video sau khi lấy dữ liệu
    useEffect(() => {
        if (isVideos) {
            const refVideo = videos.data.map(() => createRef());
            setListRefVideo(refVideo);
        }
    }, [videos.data, isVideos]);

    // Callback để phát video khi rê chuột qua
    const handlePlayWhenMouseOver = useCallback(
        (video) => {
            if (isLoading) return;

            if (playingVideo && playingVideo !== video) {
                playingVideo.pause();
                playingVideo.currentTime = 0;
            }
            setPlayingVideo(video);
            if (video && video.paused) {
                video.play().catch((err) => {
                    return;
                });
            }
        },
        [isLoading, playingVideo],
    );

    // Callback để chọn menu
    const handleSelectedMenu = useCallback((type) => {
        setTypeMenu(type);
    }, []);

    // Callback để điều hướng đến video chi tiết
    const handleNavigate = useCallback(
        (videoId, index) => {
            if (isLoading) return;
            if (!token && !user) {
                setIsShowModalLogin(true);
                return;
            }
            dispatch(setIndexVideo(index));
            dispatch(setPreviousLocation(location.pathname));
            navigate(`/video/${videoId}`);
        },
        [isLoading, dispatch, navigate, token, user, location],
    );

    const renderVideos = useMemo(() => {
        return videos.data.map((video, index) => (
            <div className={cx('video-item')} key={index}>
                <video
                    loop
                    ref={listRefVideo[index]}
                    className={cx('video')}
                    src={video?.file_url}
                    poster={video?.thumb_url}
                    onMouseOver={() => handlePlayWhenMouseOver(listRefVideo[index]?.current)}
                    onClick={() => handleNavigate(video.uuid, index)}
                    onError={(e) => {
                        e.target.poster = themeContext.isDark ? images.loadLight : images.loadDark;
                    }}
                >
                    <source src={video?.file_url || listVideos.fallbackVideo} type="video/mp4" />
                </video>
                <div
                    className={cx('wrapper-views')}
                    onClick={() => handleNavigate(video.uuid, index)}
                    onMouseOver={() => handlePlayWhenMouseOver(listRefVideo[index]?.current)}
                >
                    <PauseIcon style={{ marginRight: 4 }} />
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.6rem' }}>
                        {video.views_count}
                    </strong>
                </div>
            </div>
        ));
    }, [videos.data, listRefVideo, handlePlayWhenMouseOver, handleNavigate, themeContext]);

    return (
        <div className={cx('content')}>
            <div className={cx('nav-menu')}>
                <Button
                    className={cx('nav-button', { active: typeMenu === 'videos' })}
                    onClick={() => handleSelectedMenu('videos')}
                >
                    <span className={cx('title')}>Videos</span>
                </Button>
                {currentUser && myProfile && (
                    <Button
                        leftIcon={<LockIcon className={cx('icon')} />}
                        className={cx('nav-button', { active: typeMenu === 'favorites' })}
                        onClick={() => handleSelectedMenu('favorites')}
                    >
                        <span className={cx('title')}>Favorites</span>
                    </Button>
                )}
                <Button
                    leftIcon={<LockIcon className={cx('icon')} />}
                    className={cx('nav-button', { active: typeMenu === 'liked' })}
                    onClick={() => handleSelectedMenu('liked')}
                >
                    <span className={cx('title')}>Liked</span>
                </Button>
                <div className={cx('tab-line')}></div>
            </div>
            <div className={cx('videos', { loading: isLoading })}>
                {isLoading ? (
                    <div className={cx('no-video', { loading: isLoading })}>
                        {loadingVideoItem.map((_, index) => (
                            <div key={index} className={cx('no-video-item', { loading: isLoading })}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {typeMenu === 'videos' && isVideos && !isLoading && (
                            <div className={cx('has-video')}>{renderVideos}</div>
                        )}
                        {typeMenu === 'videos' && !isVideos && !isLoading && (
                            <NotFoundActive
                                icon={<SvgIcon style={{ width: 44, height: 44 }} icon={<NoVideoIcon />} />}
                                title={currentUser && myProfile ? 'Upload your first video' : 'No content'}
                                desc={
                                    currentUser && myProfile
                                        ? 'Your videos will appear here'
                                        : 'This user has not published any videos.'
                                }
                            />
                        )}
                        {typeMenu === 'favorites' && (
                            <NotFoundActive
                                noBorder
                                icon={<SvgIcon icon={<FavoritesIcon />} />}
                                title="Favorite posts"
                                desc={'Your favorite posts will appear here.'}
                            />
                        )}
                        {typeMenu === 'liked' && (
                            <NotFoundActive
                                noBorder
                                icon={<SvgIcon icon={currentUser && myProfile ? <FavoritesIcon /> : <PrivateIcon />} />}
                                title={
                                    currentUser && myProfile
                                        ? 'No liked videos yet'
                                        : "This user's liked videos are private"
                                }
                                desc={
                                    currentUser && myProfile
                                        ? 'Videos you liked will appear here.'
                                        : `Videos liked by ${data?.nickname} are currently hidden`
                                }
                            />
                        )}
                    </>
                )}
            </div>
            <LoginModal isShowModalLoginForm={isShowModalLogin} setIsShowModalLoginForm={setIsShowModalLogin} />
        </div>
    );
}

Content.propTypes = {
    isLoading: PropTypes.bool,
};

export default memo(Content);
