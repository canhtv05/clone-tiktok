import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import {
    HeartFillIcon,
    MessageFillIcon,
    FavoritesFillIcon,
    ShareFillIcon,
    SuccessAddFavoritesIcon,
} from '~/components/Icons';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviousLocation } from '~/redux/slices/previousLocationSlice';
import { setIndexVideoHome } from '~/redux/slices/indexVideoHomeSlice';
import { setReloadPage } from '~/redux/slices/pageSlice';
import { likeAPost } from '~/services/likes/likeAPost';
import { unlikeAPost } from '~/services/likes/unlikeAPost';
import { setIsLikedByIndexVideoHome } from '~/redux/slices/listVideosHomeSlice';
import ModalSuccess from '~/components/Modals/ModalSuccess';

const cx = classNames.bind(styles);

function ButtonContainerArticle({ data, dataIndex, setIsShowModalLogin, handlePauseVideo }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(null);
    const [isClickFavorite, setIsClickFavorite] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [isShowModalSuccess, setIsShowModalSuccess] = useState(false);

    const token = localStorage.getItem('token');

    const aVideoHome = useSelector((state) => state.listVideosHome.listVideosHome)[dataIndex];

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;
        setIsLiked(aVideoHome?.is_liked);
        setLikesCount(aVideoHome?.likes_count);
    }, [data, aVideoHome]);

    const handleToCommentPage = useCallback(() => {
        if (!token) {
            setIsShowModalLogin(true);
            return;
        }

        dispatch(setPreviousLocation(location.pathname));
        dispatch(setIndexVideoHome(dataIndex));
        dispatch(setReloadPage(true));
        handlePauseVideo();
        navigate(`/video/${data?.uuid}`, { state: { background: location } });
    }, [data, dataIndex, dispatch, location, navigate, token, setIsShowModalLogin, handlePauseVideo]);

    const handleLikeVideo = useCallback(async () => {
        if (!token) {
            setIsShowModalLogin(true);
            return;
        }

        if (isLiked) {
            setIsLiked(false);
            setLikesCount((prev) => prev - 1);
            dispatch(setIsLikedByIndexVideoHome({ is_liked: false, indexVideo: dataIndex, likes_count: likesCount }));
            await unlikeAPost(data?.id, token);
        } else {
            setIsLiked(true);
            setLikesCount((prev) => prev + 1);
            dispatch(setIsLikedByIndexVideoHome({ is_liked: true, indexVideo: dataIndex, likes_count: likesCount }));
            await likeAPost(data?.id, token);
        }
    }, [isLiked, token, data, dispatch, dataIndex, likesCount, setIsShowModalLogin]);

    const handleSharesCount = useCallback(() => {
        if (!token) {
            setIsShowModalLogin(true);
            return;
        }

        if (isClickFavorite) {
            setFavoritesCount((prev) => Math.max(prev - 1), 0);
            setIsClickFavorite(false);
        } else {
            setFavoritesCount((prev) => prev + 1 || 1);
            setIsClickFavorite(true);
            setIsShowModalSuccess(true);
        }
    }, [isClickFavorite, token, setIsShowModalLogin]);

    return (
        <>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={
                        <HeartFillIcon
                            width="2.4rem"
                            height="2.4rem"
                            style={{ color: isLiked ? 'var(--primary)' : 'currentColor' }}
                        />
                    }
                    className={cx('btn-heart')}
                    onClick={handleLikeVideo}
                ></Button>
                <strong className={cx('strong-text')}>{likesCount ?? aVideoHome?.likes_count}</strong>
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
                    midIcon={<FavoritesFillIcon style={{ color: isClickFavorite ? '#FACE15' : 'currentColor' }} />}
                    className={cx('btn-favorite')}
                    onClick={handleSharesCount}
                ></Button>
                <strong className={cx('strong-text')}>{favoritesCount}</strong>
            </div>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={<ShareFillIcon width="2.4rem" height="2.4rem" />}
                    className={cx('btn-share')}
                ></Button>
                <strong className={cx('strong-text')}>{data?.shares_count}</strong>
            </div>
            <ModalSuccess
                title="Added to Favorites"
                leftIcon
                icon={<SuccessAddFavoritesIcon />}
                isShow={isShowModalSuccess}
                setIsShow={setIsShowModalSuccess}
            />
        </>
    );
}

ButtonContainerArticle.propTypes = {
    data: PropTypes.shape({
        likes_count: PropTypes.number.isRequired,
        comments_count: PropTypes.number.isRequired,
        shares_count: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
    }).isRequired,
    dataIndex: PropTypes.number,
    setIsShowModalLogin: PropTypes.func,
};

export default memo(ButtonContainerArticle);
