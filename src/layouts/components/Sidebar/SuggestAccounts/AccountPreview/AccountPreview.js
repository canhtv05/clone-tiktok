import { memo, useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';

const cx = classNames.bind(styles);

function AccountPreview({ data, showBio = false }) {
    const [follow, setFollow] = useState(data?.is_followed || false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setFollow(data?.is_followed);
    }, [data]);

    const handleFollowToggle = useCallback(() => {
        const fetchApi = async () => {
            try {
                if (follow) {
                    await unfollowAUser(data?.id, token);
                } else {
                    await followAUser(data?.id, token);
                }

                setFollow((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, [data?.id, follow, token]);

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Image src={data.avatar} alt="avatar" className={cx('avatar')} />
                <Button className={cx('follow-btn', { following: follow })} primary onClick={handleFollowToggle}>
                    {follow ? 'Following' : 'Follow'}
                </Button>
            </header>
            <div className={cx('body')}>
                <p className={cx('nickname')}>
                    <strong>{data.nickname}</strong>
                    {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                </p>
                <p className={cx('name')}>{`${data.first_name} ${data.last_name}`}</p>
                <p className={cx('analytics')}>
                    <strong className={cx('value')}>{data.followers_count} </strong>
                    <span className={cx('label')}>Followers</span>
                    <strong className={cx('value')}>{data.likes_count} </strong>
                    <span className={cx('label')}>Likes</span>
                </p>
                {showBio && <p className={cx('show-bio')}>{data.bio || 'No bio yet.'}</p>}
            </div>
        </div>
    );
}

AccountPreview.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        nickname: PropTypes.string.isRequired,
        tick: PropTypes.bool,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        followers_count: PropTypes.number.isRequired,
        likes_count: PropTypes.number.isRequired,
    }).isRequired,
};

export default memo(AccountPreview);
