import { memo, useCallback } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Image from '~/components/Image';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setNickName } from '~/redux/slices/nicknameSlice';
import BottomAction from '../BottomAction';
import ModalDelete from '~/components/Modals/ModalDelete';
import { EllipsisIcon, LikeFillIcon, LikeIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function RenderCommentsItem({
    listRender,
    isLoading,
    handleFollow,
    listFollowing,
    handleShowReply,
    data = {},
    replyIndex,
    handleReplyComment,
    inputRef,
    openDeleteModal,
    renderEllipsisTippy,
    handleLikeComment,
    listLike,
    handleDeleteComment,
    showModalDelete,
    commentIdToDelete,
    setShowModalDelete,
}) {
    const dispatch = useDispatch();
    const nav = useNavigate();

    const user = useSelector((state) => state.currentUser.currentUser);
    const getNickname = useSelector((state) => state.getNickname.nickname);

    const handleNavigate = useCallback(
        (nickname, idUser) => {
            if (nickname === user) {
                dispatch(setMyAccount(true));
            }
            if (nickname !== getNickname) {
                dispatch(setProfile({}));
            }
            dispatch(setIdUser(idUser));
            dispatch(setNickName(`@${nickname}`));
            nav(`/profile/@${nickname}`);
        },
        [dispatch, user, nav, getNickname],
    );

    const renderPopper = useCallback(
        (data, index) => {
            return (
                <PopperWrapper>
                    <AccountPreview
                        data={data?.user}
                        showBio
                        onClick={() => handleFollow(data?.user, index)}
                        isFollowing={listFollowing[index]?.isFollowing}
                    />
                </PopperWrapper>
            );
        },
        [handleFollow, listFollowing],
    );

    return (
        !isLoading &&
        listRender.map((item, index) => (
            <span key={index}>
                <div className={cx('comment-content-container')}>
                    <span>
                        <TippyHeadless
                            render={() => renderPopper(item, index)}
                            interactive
                            offset={[140, 0]}
                            placement="bottom"
                            delay={[200, 200]}
                            popperOptions={{
                                modifiers: [
                                    {
                                        name: 'flip',
                                        options: {
                                            fallbackPlacements: [],
                                        },
                                    },
                                ],
                            }}
                        >
                            <Link
                                className={cx('styled-link-avatar')}
                                onClick={() => handleNavigate(item?.user?.nickname)}
                                to={`/profile/@${item?.user?.nickname}`}
                            >
                                <span className={cx('span-avatar-container')}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            marginTop: '5px',
                                            objectFit: 'cover',
                                        }}
                                        src={item.user.avatar}
                                        className={cx('image-avatar')}
                                    />
                                </span>
                            </Link>
                        </TippyHeadless>
                    </span>
                    <div className={cx('content-container')}>
                        <Link
                            className={cx('styled-user-link-name')}
                            onClick={() => handleNavigate(item?.user?.nickname, item?.user?.id)}
                            to={`/profile/@${item?.user?.nickname}`}
                        >
                            <span
                                className={cx('user-name-text')}
                            >{`${item?.user?.first_name} ${item?.user?.last_name || item?.user?.nickname}`}</span>
                            {item?.user?.id === data?.user_id && (
                                <span>
                                    <span className={cx('dot')}>{' • '}</span>
                                    <span className={cx('author')}>{'Creator'}</span>
                                </span>
                            )}
                        </Link>
                        <p className={cx('comment-text')}>
                            <span>{item?.comment}</span>
                        </p>
                        <div className={cx('comment-sub-content')}>
                            <span className={cx('span-created-time')}>{`${item?.updated_at.split(' ')[0]}`}</span>
                            <span className={cx('span-reply-button')} onClick={() => handleShowReply(index)}>
                                {' Reply'}
                            </span>
                            {replyIndex === index && (
                                <div className={cx('wrapper-bottom-comment')}>
                                    <BottomAction
                                        noPadding
                                        onClick={() =>
                                            handleReplyComment(
                                                `${item?.user?.first_name} ${item?.user?.last_name || item?.user?.nickname}`,
                                            )
                                        }
                                        inputRef={inputRef}
                                        onFocus
                                    />
                                    <span className={cx('icon-times')} onClick={handleShowReply}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cx('action-container-comment')}>
                        <div className={cx('like-wrapper')}>
                            <div className={cx('ellipsis-icon')}>
                                <TippyHeadless
                                    render={() =>
                                        renderEllipsisTippy(item?.currentUserComment, () =>
                                            openDeleteModal(item?.currentUserComment ? item.id : undefined),
                                        )
                                    }
                                    placement="bottom"
                                    interactive
                                    offset={[-80, 10]}
                                    popperOptions={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: [],
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <span>
                                        <EllipsisIcon />
                                    </span>
                                </TippyHeadless>
                            </div>
                            <div className={cx('like-icon')} onClick={() => handleLikeComment(item.id, index)}>
                                {listLike[index]?.isLike ? (
                                    <LikeFillIcon style={{ color: 'var(--primary)' }} />
                                ) : (
                                    <LikeIcon />
                                )}
                            </div>
                            <div className={cx('span-count')}>{listLike[index]?.likesCount}</div>
                        </div>
                    </div>
                </div>
                {showModalDelete && (
                    <ModalDelete
                        title={'Are you sure you want to delete this comment?'}
                        onDelete={() => handleDeleteComment(commentIdToDelete)}
                        onClose={() => setShowModalDelete(false)}
                    />
                )}
            </span>
        ))
    );
}

export default memo(RenderCommentsItem);
