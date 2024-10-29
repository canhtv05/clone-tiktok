import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import SeekBarArticle from './SeekBarArticle';
import MediaCardBottomArticle from './MediaCardBottomArticle';
import MediaCardTopArticle from './MediaCardTopArticle';
import Button from '~/components/Button';
import { FavoritesFillIcon, HeartFillIcon, MessageFillIcon, PlusIcon, ShareFillIcon } from '~/components/Icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { Link, useNavigate } from 'react-router-dom';
import Image from '~/components/Image';
import { useDispatch } from 'react-redux';
import { setProfile } from '~/redux/slices/profileSlice';

const cx = classNames.bind(styles);

function Article({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false);
    const [isMouseMove, setIsMouseMove] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const seekBarRef = useRef();
    const videoRef = useRef();
    const spanTextRef = useRef();
    const divTextRef = useRef();

    useEffect(() => {
        const widthDiv = divTextRef.current.clientWidth;
        const widthSpan = spanTextRef.current.scrollWidth;

        if (widthSpan >= widthDiv) {
            setIsTooLong(true);
        }
    }, []);

    useEffect(() => {
        if (videoRef) {
            videoRef.current.play().catch((err) => {});
        }
    }, []);

    useEffect(() => {
        // handle scroll intersection when viewport equals to 50 percent
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsPlaying(true);
                    videoRef.current.play().catch((error) => {
                        console.log(error);
                    });
                } else {
                    if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.pause();
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
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(videoRef.current);
            }
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
        if (isPlaying) {
            setIsPlaying(false);
            videoRef.current.pause();
            return;
        } else {
            setIsPlaying(true);
            videoRef.current.play().catch((err) => {});
            return;
        }
    }, [isPlaying]);

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data?.user} isFollowing={false} showBio />
                </PopperWrapper>
            </div>
        );
    };

    const handleToCommentPage = () => {
        navigate(`/video/${data?.uuid}`);
    };

    return (
        <article className={cx('container')} onScroll={() => console.log(1)}>
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
                                onWaiting={() => setIsWaiting(true)}
                                onPlaying={() => setIsWaiting(false)}
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
                </section>
                <section className={cx('action-bar-container')}>
                    <div className={cx('avatar-action-item-container')}>
                        <Tippy
                            appendTo={document.body}
                            interactive
                            delay={[800, 500]}
                            offset={[0, 25]}
                            placement="bottom-start"
                            render={renderPreview}
                        >
                            <Link to={`/profile/@${data?.user?.nickname}`} onClick={() => dispatch(setProfile({}))}>
                                <div className={cx('div-container')} style={{ width: 48, height: 48 }}>
                                    <div className={cx('avatar-wrapper')}>
                                        <span
                                            className={cx('span-avatar-container-style-avatar')}
                                            style={{ width: 48, height: 48 }}
                                        >
                                            <Image
                                                className={cx('avatar')}
                                                src={data?.user?.avatar}
                                                alt={data?.user?.nickname}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </Tippy>

                        <button className={cx('avatar-follow-button')}>
                            <div className={cx('button-content')}>
                                <PlusIcon />
                            </div>
                        </button>
                    </div>
                    <div className={cx('button-container')}>
                        <Button
                            circle
                            midIcon={<HeartFillIcon width="2.4rem" height="2.4rem" />}
                            className={cx('btn-heart')}
                        ></Button>
                        <strong className={cx('strong-text')}>{data?.likes_count}</strong>
                    </div>
                    <div className={cx('button-container')}>
                        <Button
                            circle
                            midIcon={<MessageFillIcon width="2.4rem" height="2.4rem" />}
                            className={cx('btn-comment')}
                            onClick={handleToCommentPage}
                        ></Button>
                        <strong className={cx('strong-text')}>{data?.comments_count}</strong>
                    </div>
                    <div className={cx('button-container')}>
                        <Button
                            circle
                            midIcon={<FavoritesFillIcon width="2.4rem" height="2.4rem" />}
                            className={cx('btn-favorite')}
                        ></Button>
                        <strong className={cx('strong-text')}>0</strong>
                    </div>
                    <div className={cx('button-container')}>
                        <Button
                            circle
                            midIcon={<ShareFillIcon width="2.4rem" height="2.4rem" />}
                            className={cx('btn-share')}
                        ></Button>
                        <strong className={cx('strong-text')}>{data?.shares_count}</strong>
                    </div>
                </section>
            </div>
        </article>
    );
}

Article.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Article;
