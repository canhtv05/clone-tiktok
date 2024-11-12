import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Article.module.scss';
import { PlusIcon, TickIcon } from '~/components/Icons';
import Image from '~/components/Image';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '~/redux/slices/profileSlice';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';
import { setIsFollowAUserByUserId } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

function AvatarActionItemContainerArticle({ data, dataIndex }) {
    const [isFollowed, setIsFollowed] = useState(false);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const aVideoHome = useSelector((state) => state.listVideosHome.listVideosHome)[dataIndex];

    // console.log(aVideoHome);

    useEffect(() => {
        setIsFollowed(aVideoHome.user.is_followed);
        if (!data || Object.keys(data).length === 0 || !dataIndex) return;
    }, [data, dataIndex, aVideoHome]);

    const handleFollow = useCallback(async () => {
        if (isFollowed) {
            setIsFollowed(false);
            dispatch(setIsFollowAUserByUserId({ is_follow: false, user_id: data?.user_id }));
            await unfollowAUser(data?.user_id, token);
        } else {
            setIsFollowed(true);
            dispatch(setIsFollowAUserByUserId({ is_follow: true, user_id: data?.user_id }));
            await followAUser(data?.user_id, token);
        }
    }, [data, isFollowed, token, dispatch]);

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data?.user} isFollowing={isFollowed} showBio onClick={handleFollow} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <div className={cx('avatar-action-item-container')}>
            <TippyHeadless
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
                                <Image className={cx('avatar')} src={data?.user?.avatar} alt={data?.user?.nickname} />
                            </span>
                        </div>
                    </div>
                </Link>
            </TippyHeadless>
            <button className={cx('avatar-follow-button', { followed: isFollowed })} onClick={() => handleFollow()}>
                <div className={cx('button-content')}>
                    {isFollowed ? (
                        <TickIcon width="1.4rem" height="1.4rem" style={{ color: 'var(--primary)' }} />
                    ) : (
                        <PlusIcon />
                    )}
                </div>
            </button>
        </div>
    );
}

AvatarActionItemContainerArticle.propTypes = {
    data: PropTypes.shape({
        user: PropTypes.shape({
            nickname: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    dataIndex: PropTypes.number,
};

export default memo(AvatarActionItemContainerArticle);
