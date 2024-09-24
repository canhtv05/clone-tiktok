import classNames from 'classnames/bind';
import styles from './CreatorVideo.module.scss';
import { createRef, memo, useContext, useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PauseIcon } from '~/components/Icons';
import { getVideosById } from '~/services/getVideosById';
import images from '~/assets/images';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setIndexVideo } from '~/redux/slices/indexVideoSlice';

const cx = classNames.bind(styles);

const loadingVideoItem = new Array(6).fill(1);

function CreatorVideo({ data, onClick }) {
    const [videos, setVideos] = useState({ data: [] });
    const [isVideos, setIsVideos] = useState(true);
    const [listRefVideo, setListRefVideo] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const idUser = useSelector((state) => state.idUser.idUser);

    // Tải video theo id
    const fetchVideos = useCallback(async () => {
        if (!idUser) return;

        try {
            setIsLoading(true);
            const res = await getVideosById(idUser);

            const timer = setTimeout(() => {
                setVideos(res);
                setIsVideos(res.data.length > 0);
                setIsLoading(false);
            }, 0);
            return () => clearTimeout(timer);
        } catch (error) {
            console.log(error);
        }
    }, [idUser]);

    useEffect(() => {
        if (idUser) {
            fetchVideos();
        }
    }, [idUser, fetchVideos]);

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
        (video, videoUuid) => {
            if (isLoading) return;

            if (data?.uuid === videoUuid) {
                return;
            }

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
        [playingVideo, data?.uuid, isLoading],
    );

    // Callback để điều hướng đến video chi tiết
    const handleNavigate = useCallback(
        (videoId, index) => {
            if (videoId !== data?.uuid) {
                onClick();
                dispatch(setIndexVideo(index));
                navigate(`/video/${videoId}`);
            }
        },
        [onClick, data?.uuid, dispatch, navigate],
    );

    const renderVideos = useMemo(() => {
        return videos.data.map((video, index) => (
            <div className={cx('video-item')} key={index}>
                <video
                    muted
                    loop={data?.uuid !== video.uuid}
                    ref={listRefVideo[index]}
                    className={cx('video')}
                    src={video?.file_url}
                    poster={video?.thumb_url}
                    onMouseOver={() => handlePlayWhenMouseOver(listRefVideo[index]?.current, video?.uuid)}
                    onClick={() => handleNavigate(video.uuid, index)}
                    onError={(e) => {
                        e.target.poster = themeContext.isDark ? images.loadLight : images.loadDark;
                    }}
                />
                {data?.uuid === video.uuid && (
                    <div className={cx('overlay')}>
                        <div className={cx('wrapper-loader')}>
                            <div className={cx('loader')}>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                                <div className={cx('stroke')}></div>
                            </div>
                            <div>
                                <div className={cx('now-playing')}>Now playing</div>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={cx('wrapper-views')}
                    onMouseOver={() => handlePlayWhenMouseOver(listRefVideo[index]?.current, video?.uuid)}
                    onClick={() => handleNavigate(video.uuid, index)}
                >
                    <PauseIcon style={{ marginRight: 4 }} />
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.6rem' }}>
                        {video.views_count}
                    </strong>
                </div>
            </div>
        ));
    }, [videos.data, listRefVideo, themeContext, handlePlayWhenMouseOver, handleNavigate, data?.uuid]);

    return (
        <div className={cx('wrapper-creator')}>
            {isLoading ? (
                <>
                    {loadingVideoItem.map((_, index) => (
                        <div key={index} className={cx('no-video-item', { loading: isLoading })}></div>
                    ))}
                </>
            ) : (
                renderVideos
            )}
        </div>
    );
}

CreatorVideo.propTypes = {
    data: PropTypes.shape({
        user_id: PropTypes.number,
        uuid: PropTypes.string,
    }),
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default memo(CreatorVideo);
