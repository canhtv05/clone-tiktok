import React, { memo, useCallback, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ActionButtons.module.scss';
import Button from '~/components/Button';
import { HeartFillIcon, MessageFillIcon, FavoritesFillIcon, ShareFillIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { centerRowItems } from '../MenuItem';
import { renderShareTippy } from '../TippyRenders';
import ModalSuccess from '~/components/Modals/ModalSuccess';
import { likeAPost } from '~/services/likes/likeAPost';
import { unlikeAPost } from '~/services/likes/unlikeAPost';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLikedByIndexVideoHome } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

const ActionButtons = ({ data }) => {
    const dispatch = useDispatch();
    const [likesCount, setLikesCount] = useState(null);
    const [isToggleLikesCount, setIsToggleLikesCount] = useState(false);
    const [isToggleSharesCount, setIsToggleSharesCount] = useState(false);
    const [isCopyLink, setIsCopyLink] = useState(false);
    const [sharesCount, setSharesCount] = useState(null);
    const [isLiked, setIsLike] = useState(false);
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setLikesCount(data?.likes_count);
        setSharesCount(data?.shares_count);
        setIsLike(data?.is_liked);
        setIsToggleLikesCount(data?.is_liked);
    }, [data?.likes_count, data?.shares_count, data?.is_liked]);

    const handleLikesCount = useCallback(async () => {
        try {
            if (isToggleLikesCount) {
                setLikesCount((prev) => Math.max(prev - 1, 0));
                setIsToggleLikesCount(false);
                setIsLike(false);
                dispatch(
                    setIsLikedByIndexVideoHome({
                        is_liked: false,
                        indexVideo: indexVideoHome,
                        likes_count: likesCount,
                    }),
                );
                await unlikeAPost(data?.id, token);
            } else {
                setLikesCount((prev) => prev + 1);
                setIsToggleLikesCount(true);
                setIsLike(true);
                dispatch(
                    setIsLikedByIndexVideoHome({
                        is_liked: true,
                        indexVideo: indexVideoHome,
                        likes_count: likesCount,
                    }),
                );
                await likeAPost(data?.id, token);
            }
        } catch (error) {
            console.log(error);
        }
    }, [isToggleLikesCount, data?.id, token, dispatch, likesCount, indexVideoHome]);

    const handleSharesCount = useCallback(() => {
        if (isToggleSharesCount) {
            setSharesCount((prev) => prev - 1 || 0);
            setIsToggleSharesCount(false);
        } else {
            setSharesCount((prev) => prev + 1 || 1);
            setIsToggleSharesCount(true);
        }
    }, [isToggleSharesCount]);

    const handleCopyLink = () => {
        if (data?.file_url) {
            setIsCopyLink(true);
            navigator.clipboard.writeText(data.file_url);

            const timer = setTimeout(() => {
                setIsCopyLink(false);
            }, 600);

            return () => clearTimeout(timer);
        }
    };

    return (
        <div className={cx('main-content')}>
            <div className={cx('main-content-wrapper')}>
                <div className={cx('flex-center-row')}>
                    <div className={cx('center-row')}>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button
                                circle
                                midIcon={
                                    <HeartFillIcon
                                        style={{
                                            color: isLiked ? 'var(--primary)' : 'currentColor',
                                        }}
                                    />
                                }
                                className={cx('button-icon', { 'click-like': isToggleLikesCount })}
                                onClick={handleLikesCount}
                            />
                            <strong className={cx('strong-center-row')}>{likesCount}</strong>
                        </div>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button circle midIcon={<MessageFillIcon />} className={cx('button-icon')} />
                            <strong className={cx('strong-center-row')}>{getCommentCount}</strong>
                        </div>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button
                                circle
                                midIcon={
                                    <FavoritesFillIcon
                                        style={{ color: isToggleSharesCount ? '#FACE15' : 'currentColor' }}
                                    />
                                }
                                className={cx('button-icon', { 'click-favorite': isToggleSharesCount })}
                                onClick={handleSharesCount}
                            />
                            <strong className={cx('strong-center-row')}>{sharesCount}</strong>
                        </div>
                    </div>
                    <div className={cx('center-row')}>
                        {centerRowItems.map((item, index) => (
                            <div key={index} className={cx('share-link')}>
                                <Tippy interactive content={item.title} offset={[0, 10]} placement="top">
                                    <div>
                                        <span className={cx('center-icon')}>{item.icon}</span>
                                    </div>
                                </Tippy>
                            </div>
                        ))}
                        <button className={cx('button-share')}>
                            <TippyHeadless offset={[-120, 15]} placement="bottom" interactive render={renderShareTippy}>
                                <span>
                                    <ShareFillIcon />
                                </span>
                            </TippyHeadless>
                        </button>
                    </div>
                </div>
                <div className={cx('copy-link-container')}>
                    <p className={cx('p-copy-link-text')}>{data?.file_url}</p>
                    <button className={cx('button-copy-link')} onClick={handleCopyLink}>
                        Copy link
                    </button>
                </div>
                {isCopyLink && <ModalSuccess title="Copied" />}
            </div>
        </div>
    );
};

ActionButtons.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number,
        likes_count: PropTypes.number,
        shares_count: PropTypes.number,
        is_liked: PropTypes.bool,
        file_url: PropTypes.string,
        comments_count: PropTypes.number,
    }),
    isLoading: PropTypes.bool,
};

export default memo(ActionButtons);
