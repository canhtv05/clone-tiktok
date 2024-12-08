import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import BottomAction from '../BottomAction';
import ModalDelete from '~/components/Modals/ModalDelete';
import { EllipsisIcon, LikeFillIcon, LikeIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';

const cx = classNames.bind(styles);

function RenderMyComment({
    valueComment,
    isLoading,
    renderPopper,
    handleNavigate,
    handleShowReply,
    replyIndex,
    handleReplyComment,
    inputRef,
    renderEllipsisTippy,
    openDeleteModal,
    handleLikeCurrentUserComment,
    showModalDelete,
    handleDeleteComment,
    commentIdToDelete,
    setShowModalDelete,
}) {
    return (
        <div>
            {valueComment.length > 0 &&
                !isLoading &&
                valueComment
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                        <div key={index} className={cx('comment-content-container')}>
                            <span>
                                <TippyHeadless
                                    render={() => renderPopper(comment, index)}
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
                                        onClick={() => handleNavigate(comment.user.nickname)}
                                        to={`/profile/@${comment.user.nickname}`}
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
                                                src={comment.user.avatar}
                                                className={cx('image-avatar')}
                                            />
                                        </span>
                                    </Link>
                                </TippyHeadless>
                            </span>
                            <div className={cx('content-container')}>
                                <Link
                                    className={cx('styled-user-link-name')}
                                    to={`/profile/@${comment.user.fullName}`}
                                    onClick={() => handleNavigate(comment.user.nickname)}
                                >
                                    <span className={cx('user-name-text')}>{comment.user.fullName}</span>
                                </Link>
                                <p className={cx('comment-text')}>
                                    <span>{comment.user.content}</span>
                                </p>
                                <div className={cx('comment-sub-content')}>
                                    <span className={cx('span-created-time')}>{comment.user.date}</span>
                                    <span
                                        className={cx('span-reply-button')}
                                        onClick={() => handleShowReply(index - valueComment.length)}
                                    >
                                        {' Reply'}
                                    </span>
                                    {replyIndex === index - valueComment.length && (
                                        <div className={cx('wrapper-bottom-comment')}>
                                            <BottomAction
                                                noPadding
                                                onClick={() => handleReplyComment(`${comment.user.fullName}`)}
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
                                                renderEllipsisTippy(true, () => openDeleteModal(comment.user.idComment))
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
                                    <div
                                        className={cx('like-icon')}
                                        onClick={() => handleLikeCurrentUserComment(comment.user.idComment, index)}
                                    >
                                        {comment.user.isLike ? (
                                            <LikeFillIcon style={{ color: 'var(--primary)' }} />
                                        ) : (
                                            <LikeIcon />
                                        )}
                                    </div>
                                    <div className={cx('span-count')}>{comment.user.likesCount}</div>
                                </div>
                            </div>
                            {showModalDelete && (
                                <ModalDelete
                                    title={'Are you sure you want to delete this comment?'}
                                    onDelete={() => handleDeleteComment(commentIdToDelete)}
                                    onClose={() => setShowModalDelete(false)}
                                />
                            )}
                        </div>
                    ))}
        </div>
    );
}

export default memo(RenderMyComment);
