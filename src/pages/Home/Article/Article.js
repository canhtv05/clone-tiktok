import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import images from '~/assets/images';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    BrokenHeartIcon,
    EllipsisIcon,
    FlagIcon,
    MusicNoticeIcon,
    NotVolumeIcon,
    ScrollIcon,
    VolumeIcon,
} from '~/components/Icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAVideo } from '~/services/getAVideo';
import Button from '~/components/Button';
import TippyEllipsis from '~/components/TippyEllipsis';
import { useDispatch } from 'react-redux';
import { setProfile } from '~/redux/slices/profileSlice';

const cx = classNames.bind(styles);

const menuItem = [
    {
        title: 'Auto scroll',
        icon: <ScrollIcon />,
        separate: true,
        toggle: true,
    },
    {
        title: 'Not interested',
        icon: <BrokenHeartIcon />,
        separate: true,
    },
    {
        title: 'Report',
        icon: <FlagIcon />,
        separate: false,
    },
];

function Article({ data }) {
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [previousVolume, setPreviousVolume] = useState(50);
    const [isTooLong, setIsTooLong] = useState(false);
    const [isClickMore, setIsClickMore] = useState(false);
    const [isMouseMove, setIsMouseMove] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const videoRef = useRef();
    const seekBarRef = useRef();
    const volumeRef = useRef();
    const spanTextRef = useRef();
    const divTextRef = useRef();
    const divMultiLineTextRef = useRef();

    useEffect(() => {
        const widthDiv = divTextRef.current.clientWidth;
        const widthSpan = spanTextRef.current.scrollWidth;

        if (widthSpan >= widthDiv) {
            setIsTooLong(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    videoRef.current.play().catch((error) => {
                        return;
                    });
                    setIsPlaying(true);
                } else {
                    if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                    }
                    setIsPlaying(false);
                }
            },
            { threshold: 0.5 }, // Phát video khi 50% của nó vào viewport
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // âm thanh hiện tại max = 1
    useEffect(() => {
        if (videoRef.current) {
            volumeRef.current.style.background = `linear-gradient(90deg, #fff ${volume}%, transparent 0)`;
            videoRef.current.volume = volume / 100;
        }
        seekBarRef.current.value = 0;
    }, [volume]);

    const formattedTime = useMemo(() => {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        return formatTime(currentTime || 0) + ' / ' + formatTime(duration || 0);
    }, [currentTime, duration]);

    const handleOnInputVideo = () => {
        const seekBar = seekBarRef.current;
        const newTime = (seekBar.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        const value = seekBar.value;
        seekBar.style.background = `linear-gradient(90deg, var(--primary) ${+value}%, transparent 0)`;
    };

    const handleTimeUpdate = () => {
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        const progress = (current / total) * 100;
        seekBarRef.current.value = progress;
        seekBarRef.current.style.background = `linear-gradient(90deg, var(--primary) ${+progress}%, transparent 0)`;
    };

    const handlePlayVideo = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            videoRef.current.pause();
            return;
        } else {
            setIsPlaying(true);
            videoRef.current.play();
            return;
        }
    }, [isPlaying]);

    const handleOnInputVolume = useCallback(() => {
        const newVolume = volumeRef.current.value;
        volumeRef.current.style.background = `linear-gradient(90deg, #fff ${+newVolume}%, transparent 0)`;
        setVolume(newVolume);
        setPreviousVolume(newVolume);
    }, []);

    const handleNoVolume = useCallback(() => {
        if (volume <= 0) {
            setVolume(previousVolume <= 0 ? 50 : previousVolume);
            volumeRef.current.style.background = `linear-gradient(90deg, #fff ${+previousVolume}%, transparent 0)`;
        } else {
            setPreviousVolume(volume);
            volumeRef.current.style.background = `linear-gradient(90deg, #fff 0%, transparent 0)`;
            setVolume(0);
        }
    }, [volume, previousVolume]);

    const handleShowMoreText = () => {
        if (!isClickMore) {
            divMultiLineTextRef.current.style.setProperty('-webkit-box-orient', 'unset');
            divMultiLineTextRef.current.style.setProperty('-webkit-line-clamp', 'unset');
            setIsClickMore(true);
        }
    };

    const handleLessText = () => {
        if (isClickMore) {
            divMultiLineTextRef.current.style.setProperty('-webkit-box-orient', 'vertical');
            divMultiLineTextRef.current.style.setProperty('-webkit-line-clamp', '1');
            setIsClickMore(false);
        }
    };

    const handleMouseLeaveInputRange = () => {
        setIsMouseDown(false);
        setIsMouseMove(false);

        if (videoRef.current.paused && videoRef) {
            videoRef.current.play().catch((error) => {
                return;
            });
        }
    };

    const handleMouseMove = (e) => {
        e.stopPropagation();
        setIsMouseMove(true);
        videoRef.current.pause();
    };

    const handleMouseDown = (e) => {
        e.stopPropagation();
        setIsMouseDown(true);
        videoRef.current.pause();
    };

    const handleMouseOver = () => {
        setIsMouseDown(false);
        setIsMouseMove(false);
        videoRef.current.pause();
    };

    const handleToProfile = () => {
        dispatch(setProfile({}));
    };

    return (
        <article className={cx('container')}>
            <div className={cx('wrapper-content')}>
                <section className={cx('media-card-container')}>
                    <div className={cx('base-player-container')}>
                        <div className={cx('video-container')}>
                            <video
                                // autoPlay
                                // loop
                                ref={videoRef}
                                src={data?.file_url}
                                poster={data?.thumb_url}
                                className={cx('video')}
                                onTimeUpdate={handleTimeUpdate}
                                onClick={handlePlayVideo}
                            ></video>
                        </div>
                        <div className={cx('media-card-top')}>
                            <div className={cx('media-controls-top')}>
                                <div className={cx('volume-container')}>
                                    <span className={cx('icon-volume')}>
                                        <Button
                                            onClick={handleNoVolume}
                                            className={cx('volume')}
                                            circle
                                            midIcon={volume <= 0 ? <NotVolumeIcon /> : <VolumeIcon />}
                                        />
                                    </span>
                                    <div className={cx('volume-wrapper')}>
                                        <input
                                            ref={volumeRef}
                                            min={0}
                                            max={100}
                                            step={1}
                                            className={cx('volume-progress')}
                                            type="range"
                                            value={volume}
                                            onInput={handleOnInputVolume}
                                        />
                                    </div>
                                </div>
                                <div className={cx('icon-ellipsis')}>
                                    <TippyEllipsis menuItem={menuItem} position="right" offsetX={40} offsetY={30}>
                                        <span className={cx('ellipsis')}>
                                            <EllipsisIcon style={{ color: '#fff' }} />
                                        </span>
                                    </TippyEllipsis>
                                </div>
                            </div>
                        </div>
                        {!isMouseDown && !isMouseMove && (
                            <div className={cx('media-card-bottom')}>
                                <div className={cx('author-container')}>
                                    <div className={cx('author')}>
                                        <Link
                                            className={cx('link-author')}
                                            to={`/profile/@${data?.user?.nickname}`}
                                            onClick={handleToProfile}
                                        >
                                            <h3 className={cx('author-nickname')}>
                                                {data?.user?.nickname.trim().length !== 0
                                                    ? data?.user?.nickname
                                                    : `${data?.user?.first_name} ${data?.user?.last_name}`}
                                            </h3>
                                        </Link>
                                        <span style={{ margin: '0 2px' }}>·</span>
                                        <span className={cx('post-time')}>{data?.updated_at.split(' ')[0]}</span>
                                    </div>
                                </div>
                                <div className={cx('desc-wrapper')} ref={divTextRef}>
                                    <div className={cx('multiple-text-container')}>
                                        <div className={cx('multi-line-text')} ref={divMultiLineTextRef}>
                                            <h1 className={cx('h1-container')}>
                                                <span className={cx('span-text')} ref={spanTextRef}>
                                                    {data?.description}
                                                </span>
                                            </h1>
                                        </div>
                                        {isTooLong &&
                                            (isClickMore ? (
                                                <button className={cx('button-bottom')} onClick={handleLessText}>
                                                    less
                                                </button>
                                            ) : (
                                                <button className={cx('button-bottom')} onClick={handleShowMoreText}>
                                                    more
                                                </button>
                                            ))}
                                    </div>
                                </div>
                                <div className={cx('music-and-icon-container')}>
                                    <h4 className={cx('h4-link')}>
                                        <Link className={cx('link-music')}>
                                            <MusicNoticeIcon />
                                            <span className={cx('music-text')}>
                                                {data?.music || 'Copyright by Canhtv05'}
                                            </span>
                                        </Link>
                                    </h4>
                                </div>
                            </div>
                        )}
                        <div className={cx('seek-bar-container')}>
                            {isMouseDown && isMouseMove && <p className={cx('timing')}>{formattedTime}</p>}
                            <div className={cx('seek-bar')}>
                                <div className={cx('div-seek-bar')}>
                                    <input
                                        onInput={handleOnInputVideo}
                                        ref={seekBarRef}
                                        min={0}
                                        max={100}
                                        step={1}
                                        type="range"
                                        className={cx('progress')}
                                        onMouseMove={handleMouseMove}
                                        onMouseDown={handleMouseDown}
                                        onMouseLeave={handleMouseLeaveInputRange}
                                        onMouseOver={handleMouseOver}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cx('action-bar-container')}></section>
            </div>
        </article>
    );
}

Article.propTypes = {
    data: PropTypes.object,
};

export default Article;
