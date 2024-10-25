import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './FollowingNotLogin.module.scss';
import { createRef, useCallback, useEffect, useState } from 'react';
import { getVideosList } from '~/services/getVideosList';
import Image from '~/components/Image';
import { CheckIcon } from '~/components/Icons';
import Button from '~/components/Button';
import LoginModal from '~/components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { setListFollowingNotLoginSlice } from '~/redux/slices/listFollowingNotLoginSlice';

const cx = classNames.bind(styles);

function FollowingNotLogin() {
    const dispatch = useDispatch();
    const [countLoad, setCountLoad] = useState(1);
    const page = Math.floor(Math.random() * 42) + 1;
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const listFollowingNotLoginSlice = useSelector((state) => state.listFollowingNotLogin.listFollowingNotLogin);
    const [listRefVideo, setListRefVideo] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);

    const fetchApi = useCallback(
        async (page) => {
            if (countLoad < 2) {
                try {
                    const res = await getVideosList(page, true);
                    dispatch(setListFollowingNotLoginSlice(res.data));
                } catch (error) {
                    console.log(error);
                }
            }
        },
        [dispatch, countLoad],
    );

    console.log(listFollowingNotLoginSlice);

    useEffect(() => {
        if (listFollowingNotLoginSlice.length === 0) {
            fetchApi(page);
        }
    }, [page, fetchApi, listFollowingNotLoginSlice]);

    useEffect(() => {});

    const handleScrollLoadPage = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            countLoad < 2 &&
            listFollowingNotLoginSlice.length !== 30
        ) {
            setCountLoad((prev) => prev + 1);
            fetchApi(page + 1);
        }
    }, [countLoad, page, fetchApi, listFollowingNotLoginSlice]);

    useEffect(() => {
        document.addEventListener('scroll', handleScrollLoadPage);
        return () => document.removeEventListener('scroll', handleScrollLoadPage);
    }, [handleScrollLoadPage]);

    const handleShowModalLogin = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsShowModalLogin(true);
    };

    useEffect(() => {
        if (listFollowingNotLoginSlice.length !== 0) {
            const refVideo = listFollowingNotLoginSlice.map(() => createRef());
            setListRefVideo(refVideo);
        }
    }, [listFollowingNotLoginSlice]);

    // neu cai truoc !== cai video hien tai thi dung cai truoc do
    const handlePlayVideoMouseOver = (video) => {
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
    };

    return (
        <div className={cx('user-list-wrapper')}>
            {listFollowingNotLoginSlice.map((card, index) => (
                <Link className={cx('user-card')} key={index} to={`/profile/@${card?.user?.nickname}`}>
                    <div className={cx('a-user-card')}>
                        <div className={cx('container-card')}>
                            <video
                                className={cx('video')}
                                ref={listRefVideo[index]}
                                loop
                                poster={card?.thumb_url}
                                src={card?.file_url}
                                onMouseOver={() => handlePlayVideoMouseOver(listRefVideo[index]?.current)}
                            />
                        </div>
                        <div
                            className={cx('info-container')}
                            onMouseOver={() => handlePlayVideoMouseOver(listRefVideo[index]?.current)}
                        >
                            <span
                                className={cx('avatar-container')}
                                style={{ marginBottom: 12, flexShrink: 0, width: 48, height: 48 }}
                            >
                                <Image src={card?.user?.avatar} className={cx('avatar')} />
                            </span>
                            <h3
                                className={cx('user-title')}
                            >{`${card?.user?.first_name} ${card?.user?.last_name || card?.user?.nickname}`}</h3>
                            <h4 className={cx('user-nickname')}>
                                <span className={cx('unique-nickname')}>
                                    {card?.user?.nickname}
                                    {card?.user?.tick && <CheckIcon className={cx('check')} />}
                                </span>
                            </h4>
                            <div className={cx('button-container')} onClick={handleShowModalLogin}>
                                <Button primary className={cx('btn-follow')}>
                                    Follow
                                </Button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <LoginModal setIsShowModalLoginForm={setIsShowModalLogin} isShowModalLoginForm={isShowModalLogin} />
        </div>
    );
}

export default FollowingNotLogin;
