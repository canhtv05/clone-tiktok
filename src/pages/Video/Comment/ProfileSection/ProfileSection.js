import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfileSection.module.scss';
import Image from '~/components/Image';
import { EllipsisIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderTippy } from '../TippyRenders';
import ContentSection from '../ContentSection/ContentSection';
import ActionButtons from '../ActionButtons/ActionButtons';
import Button from '~/components/Button';
import { useSelector } from 'react-redux';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const ProfileSection = ({ data }) => {
    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const [isFollowing, setIsFollowing] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (data?.user?.is_followed === undefined) return;
        setIsFollowing(data?.user?.is_followed);
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [data?.user?.is_followed]);

    const handleFollow = useCallback(async () => {
        try {
            if (isFollowing) {
                setIsFollowing(false);
                await unfollowAUser(data?.user?.id, token);
                return;
            } else {
                setIsFollowing(true);
                await followAUser(data?.user?.id, token);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }, [data?.user?.id, isFollowing, token]);

    const renderPopper = useMemo(() => {
        if (!data?.user) {
            return;
        }
        return (
            <PopperWrapper>
                <AccountPreview data={data?.user} showBio isFollowing={isFollowing} onClick={handleFollow} />
            </PopperWrapper>
        );
    }, [data?.user, handleFollow, isFollowing]);

    if (isLoading) {
        return (
            <div className={cx('profile-wrapper')}>
                <div className={cx('desc-content-wrapper')}>
                    <div className={cx('info-container')}>
                        <div className={cx('styled-link')}>
                            <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                    <div className={cx('image-avatar-loading')}></div>
                                </span>
                            </div>
                        </div>
                        <div className={cx('styled-link-styled-link', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('desc-main-content')}></div>
                </div>
                <div className={cx('main-content')}>
                    <div className={cx('main-content-wrapper')}>
                        <div className={cx('flex-center-row', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('copy-link-container')}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('profile-wrapper')}>
            <div className={cx('desc-content-wrapper')}>
                <div className={cx('info-container')}>
                    <span className="tippy">
                        <TippyHeadless render={() => renderPopper} interactive offset={[80, 20]} delay={[500, 300]}>
                            <Link className={cx('wrapper-tippy')} to={`/profile/@${data?.user?.nickname}`}>
                                <div className={cx('styled-link')}>
                                    <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                        <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                            <Image
                                                src={data?.user?.avatar || images.noImage}
                                                className={cx('image-avatar')}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('styled-link-styled-link')}>
                                    <div className={cx('span-unique-id')}>
                                        <span className={cx('span-ellipsis')}>
                                            {`${data?.user?.first_name || ''} ${data?.user?.last_name || ''}`}
                                            {data?.user?.tick && (
                                                <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                            )}
                                        </span>
                                    </div>
                                    <div className={cx('span-other-infos')}>
                                        <span className={cx('ellipsis')}>{`${data?.user?.nickname || ''}`}</span>
                                        <span
                                            style={{ marginLeft: 8 }}
                                        >{`${data?.published_at?.split(' ')[0] || ''}`}</span>
                                    </div>
                                </div>
                            </Link>
                        </TippyHeadless>
                    </span>
                    {currentUser === data?.user_id ? (
                        <div>
                            <TippyHeadless
                                delay={[0, 200]}
                                offset={[-80, 8]}
                                placement="bottom"
                                render={renderTippy}
                                interactive
                            >
                                <span>
                                    <EllipsisIcon style={{ width: 24, height: 24, cursor: 'pointer' }} />
                                </span>
                            </TippyHeadless>
                        </div>
                    ) : (
                        <div>
                            <Button
                                onClick={handleFollow}
                                className={cx('button-follow', { following: isFollowing })}
                                primary
                                outline={isFollowing}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    )}
                </div>
                <ContentSection data={data} />
            </div>
            <ActionButtons data={data} />
        </div>
    );
};

ProfileSection.propTypes = {
    data: PropTypes.object,
};

export default memo(ProfileSection);
