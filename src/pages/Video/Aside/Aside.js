import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Aside.module.scss';
import Button from '~/components/Button';
import {
    BrokenHeartIcon,
    CloseIcon,
    EllipsisIcon,
    FlagIcon,
    NextVideoIcon,
    NotVolumeIcon,
    PlayIcon,
    PrevVideoIcon,
    VolumeIcon,
} from '~/components/Icons';
import { getAVideo } from '~/services/getAVideo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideosById } from '~/services/getVideosById';
import { setIndexVideo } from '~/redux/slices/indexVideoSlice';
import { setListVideos } from '~/redux/slices/listVideoSlice';
import { setChangeIndexVideo } from '~/redux/slices/changeIndexVideoSlice';
import TippyEllipsis from '~/components/TippyEllipsis';

const cx = classNames.bind(styles);

const menuItem = [
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

function Aside() {
    const [volume, setVolume] = useState(50);
    const [previousVolume, setPreviousVolume] = useState(50);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoUrl, setVideoUrl] = useState('');
    const [listVideo, setListVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [background, setBackground] = useState('');

    const nickname = useSelector((state) => state.getNickname.nickname);
    const indexVideo = useSelector((state) => state.indexVideo.index);

    const userId = useSelector((state) => state.idUser.idUser);

    const { id } = useParams();

    const videoRef = useRef();
    const seekBarRef = useRef();
    const volumeRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get user's list video
    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const res = await getVideosById(userId);
                if (res && res.data) {
                    setListVideo(res.data);
                    dispatch(setListVideos(res.data));
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (userId) {
            fetchUserVideos();
        }
    }, [nickname, dispatch, userId]);

    useEffect(() => {
        setIsPlaying(true);
        const fetchApi = async () => {
            setLoading(true);
            try {
                const res = await getAVideo(id);
                setVideoUrl(res?.data?.file_url);
                setBackground(res?.data?.thumb_url);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchApi();
            dispatch(setChangeIndexVideo(false));
        }
    }, [id, dispatch]);

    // âm thanh hiện tại max = 1
    useEffect(() => {
        if (videoRef.current) {
            volumeRef.current.style.background = `linear-gradient(90deg, #fff ${volume}%, transparent 0)`;
            videoRef.current.volume = volume / 100;
        }
        seekBarRef.current.value = 0;
    }, [volume]);

    const handlePrevVideo = useCallback(() => {
        if (indexVideo > 0 && listVideo) {
            const index = indexVideo - 1;
            setLoading(true);
            setVideoUrl(listVideo[index]?.file_url);
            dispatch(setIndexVideo(index));
            dispatch(setChangeIndexVideo(true));
            setIsPlaying(true);
            navigate(`/video/${listVideo[index]?.uuid}`);
        }
    }, [indexVideo, listVideo, dispatch, navigate]);

    const handleNextVideo = useCallback(() => {
        if (indexVideo < listVideo.length - 1 && listVideo) {
            const index = indexVideo + 1;
            setLoading(true);
            setVideoUrl(listVideo[index]?.file_url);
            dispatch(setIndexVideo(index));
            dispatch(setChangeIndexVideo(true));
            setIsPlaying(true);
            navigate(`/video/${listVideo[index]?.uuid}`);
        }
    }, [indexVideo, listVideo, dispatch, navigate]);

    // onInput volume cập nhật thanh progress
    const handleOnInputVolume = useCallback(() => {
        const newVolume = volumeRef.current.value;
        volumeRef.current.style.background = `linear-gradient(90deg, #fff ${+newVolume}%, transparent 0)`;
        setVolume(newVolume);
        setPreviousVolume(newVolume);
    }, []);

    // không có âm thanh bật tắt  lấy lại value cũ và cập nhạt lại progress
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

    // play video
    const handlePlayVideo = useCallback(() => {
        if (loading) return;
        if (isPlaying) {
            setIsPlaying(false);
            videoRef.current.pause();
            return;
        } else {
            setIsPlaying(true);
            videoRef.current.play();
            return;
        }
    }, [isPlaying, loading]);

    // thay đổi video khi change range
    const handleOnInputVideo = () => {
        const seekBar = seekBarRef.current;
        const newTime = (seekBar.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        const value = seekBar.value;
        seekBar.style.background = `linear-gradient(90deg, #fff ${+value}%, transparent 0)`;
    };

    // update time làm mới seek bar
    const handleTimeUpdate = () => {
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        const progress = (current / total) * 100;
        seekBarRef.current.value = progress;
        seekBarRef.current.style.background = `linear-gradient(90deg, #fff ${+progress}%, transparent 0)`;
    };

    const handlePlayIconVideo = useCallback(() => {
        if (loading) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            return;
        } else {
            setIsPlaying(true);
            videoRef.current.play();
            return;
        }
    }, [isPlaying, loading]);

    const handleClose = () => {
        navigate(-1);
    };

    const formattedTime = useMemo(() => {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        return formatTime(currentTime || 0) + ' / ' + formatTime(duration || 0);
    }, [currentTime, duration]);

    const loadingVideo = () => {
        setLoading(true);
    };

    const loadSuccessVideo = () => {
        setLoading(false);
        setIsPlaying(true);
        videoRef.current.play().catch((err) => {
            return;
        });
    };

    const ButtonVolume = useCallback(() => {
        return (
            <Button
                onClick={handleNoVolume}
                className={cx('volume')}
                circle
                midIcon={volume <= 0 ? <NotVolumeIcon /> : <VolumeIcon />}
            />
        );
    }, [handleNoVolume, volume]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video')}>
                <video
                    className={cx('video-item')}
                    autoPlay
                    loop
                    ref={videoRef}
                    onClick={handlePlayVideo}
                    style={{ width: '100%', height: '100%' }}
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onError={loadingVideo}
                    onWaiting={loadingVideo}
                    onCanPlay={loadSuccessVideo}
                />
                <img loading="lazy" alt={background} className={cx('video-background')} src={background} />
                {!isPlaying && !loading && (
                    <span onClick={handlePlayIconVideo} className={cx('play-icon')}>
                        <PlayIcon />
                    </span>
                )}
                {indexVideo > 0 && (
                    <Button onClick={handlePrevVideo} className={cx('prev')} circle midIcon={<PrevVideoIcon />} />
                )}
                {listVideo.length - 1 > indexVideo && (
                    <Button onClick={handleNextVideo} className={cx('next')} circle midIcon={<NextVideoIcon />} />
                )}

                <TippyEllipsis menuItem={menuItem} arrow>
                    <span className={cx('ellipsis')}>
                        <EllipsisIcon style={{ color: '#fff' }} />
                    </span>
                </TippyEllipsis>
                <Button onClick={handleClose} className={cx('close')} circle midIcon={<CloseIcon />} />
                <div className={cx('volume-wrapper')} onClick={(e) => e.stopPropagation()}>
                    <div className={cx('volume-container')}>
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
                    <ButtonVolume />
                </div>
                <div className={cx('video-controller')}>
                    <input
                        onInput={handleOnInputVideo}
                        ref={seekBarRef}
                        type="range"
                        className={cx('seek-bar')}
                        min={0}
                        max={100}
                        step={1}
                    />
                    <div className={cx('time')}>{formattedTime}</div>
                </div>
            </div>
            {loading && <div className={cx('tiktok-loader')}></div>}
        </div>
    );
}

export default Aside;
