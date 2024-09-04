import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Content.module.scss';
import { useDispatch } from 'react-redux';
import Button from '~/components/Button';
import { FavoritesIcon, LockIcon, NoVideoIcon, PauseIcon, PrivateIcon } from '~/components/Icons';
import { createRef, memo, useEffect, useState } from 'react';
import NotFoundActive from '~/components/NotFound/NotFoundActive';
import SvgIcon from '~/components/Icons/SvgIcon';
import { getVideosById } from '~/services/getVideosById';
import { setIdVideo } from '~/redux/slices/idVideoSlice';
import listVideos from '~/assets/videos';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const loadingVideoItem = new Array(10).fill(1);

function Content({ data, isLoading }) {
    const currentUser = false;

    const [videos, setVideos] = useState([]);
    const [isVideos, setIsVideos] = useState(false);
    const [listRefVideo, setListRefVideo] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [typeMenu, setTypeMenu] = useState('videos');

    const handlePlayWhenMouseOver = (video) => {
        if (playingVideo && playingVideo !== video) {
            playingVideo.pause();
            playingVideo.currentTime = 0;
        }
        setPlayingVideo(video);
        video.play();
    };

    useEffect(() => {
        const fetchApi = async () => {
            let res = await getVideosById(data.id);
            setVideos(res);
            setIsVideos(res.data.length > 0);
        };

        if (isLoading) {
            setIsVideos(false);
        }

        if (data.id) {
            fetchApi();
        }
    }, [data.id, isLoading]);

    useEffect(() => {
        if (isVideos) {
            const refVideo = videos.data.map(() => createRef());
            setListRefVideo(refVideo);
        }
    }, [videos.data, isVideos, isLoading]);

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    const dispatch = useDispatch();
    const handleGetIdVideo = (video) => {
        dispatch(setIdVideo(video));
    };

    const renderNotFound = (icon, title, desc, noBorder = false) => (
        <NotFoundActive
            noBorder={noBorder}
            icon={<SvgIcon icon={icon} style={{ width: 44, height: 44 }} />}
            title={title}
            desc={desc}
        />
    );

    return (
        <div className={cx('content')}>
            <div className={cx('nav-menu')}>
                <Button
                    className={cx('nav-button', { active: typeMenu === 'videos' })}
                    onClick={() => handleSelectedMenu('videos')}
                >
                    <span className={cx('title')}>Videos</span>
                </Button>
                {currentUser && (
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
                    <div className={cx('has-video', { loading: isLoading })}>
                        {loadingVideoItem.map((_, index) => (
                            <div key={index} className={cx('video-item', { loading: isLoading })}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {typeMenu === 'videos' &&
                            !isVideos &&
                            (currentUser ? (
                                <NotFoundActive
                                    icon={<SvgIcon style={{ width: 44, height: 44 }} icon={<NoVideoIcon />} />}
                                    title="Upload your first video"
                                    desc="Your videos will appear here"
                                />
                            ) : (
                                <NotFoundActive
                                    icon={<SvgIcon style={{ width: 44, height: 44 }} icon={<NoVideoIcon />} />}
                                    title="No content"
                                    desc="This user has not published any videos."
                                />
                            ))}
                        {typeMenu === 'videos' && isVideos && (
                            <div className={cx('has-video')}>
                                {videos.data.map((video, index) => (
                                    <div className={cx('video-item')} key={index}>
                                        <video
                                            loop
                                            ref={listRefVideo[index]}
                                            className={cx('video')}
                                            src={video?.file_url || listVideos.fallbackVideo}
                                            poster={video?.thumb_url || images.avatar}
                                            onMouseOver={() => handlePlayWhenMouseOver(listRefVideo[index]?.current)}
                                            onClick={() => handleGetIdVideo(video?.uuid)}
                                            onError={(e) => {
                                                e.target.src = listVideos.fallbackVideo;
                                                e.target.poster = images.loadImage;
                                            }}
                                        >
                                            <source
                                                src={video?.file_url || listVideos.fallbackVideo}
                                                type="video/mp4"
                                            />
                                        </video>
                                        <div className={cx('wrapper-views')}>
                                            <PauseIcon style={{ marginRight: 4 }} />
                                            <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.6rem' }}>
                                                {video.views_count}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {typeMenu === 'favorites' &&
                            !isVideos &&
                            renderNotFound(
                                <FavoritesIcon />,
                                'Favorite posts',
                                'Your favorite posts will appear here.',
                                true,
                            )}
                        {typeMenu === 'liked' &&
                            (currentUser ? (
                                renderNotFound(
                                    <FavoritesIcon />,
                                    'Favorite posts',
                                    'Your favorite posts will appear here.',
                                    true,
                                )
                            ) : (
                                <NotFoundActive
                                    noBorder
                                    icon={<SvgIcon icon={<PrivateIcon />} />}
                                    title="This user's liked videos are private"
                                    desc={`Videos liked by ${data.nickname} are currently hidden`}
                                />
                            ))}
                    </>
                )}
            </div>
        </div>
    );
}

Content.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string,
        nickname: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
    isLoading: PropTypes.bool,
};

export default memo(Content);
