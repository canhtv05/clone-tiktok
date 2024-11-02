import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import SeekBarArticle from './SeekBarArticle';
import MediaCardBottomArticle from './MediaCardBottomArticle';
import MediaCardTopArticle from './MediaCardTopArticle';

import ButtonContainerArticle from './ButtonContainerArticle';
import AvatarActionItemContainerArticle from './AvatarActionItemContainerArticle';
import Button from '~/components/Button';
import { Play2Icon, PlayIcon } from '~/components/Icons';
import TikTokLoader from '~/components/TikTokLoader';

const cx = classNames.bind(styles);

const Article = forwardRef(({ data, dataIndex }, ref) => {
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false);
    const [isMouseMove, setIsMouseMove] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);

    const seekBarRef = useRef();
    const videoRef = useRef();
    const spanTextRef = useRef();
    const divTextRef = useRef();

    useEffect(() => {
        setIsWaiting(false);

        const widthDiv = divTextRef.current.clientWidth;
        const widthSpan = spanTextRef.current.scrollWidth;

        if (widthSpan >= widthDiv) {
            setIsTooLong(true);
        }
    }, []);

    useEffect(() => {
        if (isShowIcon) {
            const timer = setTimeout(() => {
                setIsShowIcon(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isShowIcon]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            // Phát khi 50% video vào viewport
            // mute mới phát được video tự động
            async (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    videoRef.current.muted = true;
                    try {
                        await videoRef.current.play();
                        videoRef.current.muted = false;
                        setIsPlaying(true);
                        setIsShowIcon(false);
                    } catch (error) {}
                } else {
                    try {
                        await videoRef.current.pause();
                        setIsShowIcon(false);
                        setIsPlaying(false);
                        videoRef.current.currentTime = 0;
                    } catch (error) {}
                }
            },
            { threshold: 0.5 },
        );

        if (videoRef.current) observer.observe(videoRef.current);

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

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
        if (isWaiting) return;
        if (isPlaying) {
            setIsPlaying(false);
            videoRef.current.pause();
        } else {
            setIsPlaying(true);
            videoRef.current.play().catch((err) => {});
        }
        setIsShowIcon(true);
    }, [isPlaying, isWaiting]);

    const handleWaitingVideo = () => {
        setIsPlaying(false);
        setIsWaiting(true);
    };

    const handlePlayingVideo = () => {
        setIsWaiting(false);
    };

    return (
        <article className={cx('container')} ref={ref} data-index={dataIndex}>
            <div className={cx('wrapper-content')}>
                <section className={cx('media-card-container')}>
                    <div className={cx('base-player-container')}>
                        <div className={cx('video-container')}>
                            <video
                                loop
                                ref={videoRef}
                                src={data?.file_url}
                                poster={data?.thumb_url}
                                className={cx('video', { waiting: isWaiting })}
                                onTimeUpdate={handleTimeUpdate}
                                onClick={handlePlayVideo}
                                onWaiting={handleWaitingVideo}
                                onPlaying={handlePlayingVideo}
                            ></video>
                        </div>
                        <MediaCardTopArticle seekBarRef={seekBarRef} videoRef={videoRef} />
                        {!isMouseDown && !isMouseMove && (
                            <MediaCardBottomArticle
                                data={data}
                                divTextRef={divTextRef}
                                isTooLong={isTooLong}
                                spanTextRef={spanTextRef}
                            />
                        )}
                        <SeekBarArticle
                            currentTime={currentTime}
                            duration={duration}
                            isMouseDown={isMouseDown}
                            isMouseMove={isMouseMove}
                            seekBarRef={seekBarRef}
                            setIsMouseDown={setIsMouseDown}
                            setIsMouseMove={setIsMouseMove}
                            videoRef={videoRef}
                        />
                    </div>
                    {isPlaying && isShowIcon && (
                        <Button className={cx('btn-play')} circle midIcon={<PlayIcon />}></Button>
                    )}
                    {!isPlaying && isShowIcon && (
                        <Button className={cx('btn-play')} circle midIcon={<Play2Icon />}></Button>
                    )}
                    {isWaiting && <TikTokLoader top={50} left={50} />}
                </section>
                <section className={cx('action-bar-container')}>
                    <AvatarActionItemContainerArticle data={data} />
                    <ButtonContainerArticle data={data} dataIndex={dataIndex} />
                </section>
            </div>
        </article>
    );
});

Article.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Article;
