import { memo, useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function AccountPreview({ data, showBio = false, isFollowing, onClick = defaultFn }) {
    const [follow, setFollow] = useState(isFollowing);

    useEffect(() => {
        setFollow(isFollowing);
    }, [isFollowing]);

    const handleFollowToggle = useCallback(() => {
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link to={`/profile/@${data.nickname}`}>
                    <Image src={data.avatar} alt="avatar" className={cx('avatar')} />
                </Link>
                <Button className={cx('follow-btn', { following: follow })} primary onClick={handleFollowToggle}>
                    {follow ? 'Following' : 'Follow'}
                </Button>
            </div>
            <div className={cx('body')}>
                <Link to={`/profile/@${data.nickname}`}>
                    <p className={cx('nickname')}>
                        <strong>{data.nickname}</strong>
                        {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                    </p>
                    <p className={cx('name')}>{`${data.first_name} ${data.last_name}`}</p>
                </Link>
                <p className={cx('analytics')}>
                    <strong className={cx('value')}>{data.followers_count} </strong>
                    <span className={cx('label')}>Followers</span>
                    <strong className={cx('value')}>{data.likes_count} </strong>
                    <span className={cx('label')}>Likes</span>
                </p>
                {showBio && <p className={cx('show-bio', { 'has-bio': data?.bio })}>{data.bio}</p>}
            </div>
        </div>
    );
}

AccountPreview.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string,
        nickname: PropTypes.string,
        tick: PropTypes.bool,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        followers_count: PropTypes.number,
        likes_count: PropTypes.number,
    }),
};

export default memo(AccountPreview);
