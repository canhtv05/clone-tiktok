import { memo, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { useDispatch } from 'react-redux';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function AccountPreview({ data, showBio = false, isFollowing, onClick = defaultFn }) {
    const [follow, setFollow] = useState(isFollowing);
    const nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setFollow(isFollowing);
    }, [isFollowing]);

    const handleFollowToggle = useCallback(() => {
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    const handleNavigate = useCallback(() => {
        // dispatch(setNickName(`@${data.nickname}`));
        if (data?.id) {
            dispatch(setIdUser(data?.id));
        }
        nav(`/profile/@${data.nickname}`);
    }, [data, dispatch, nav]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link to={`/profile/@${data.nickname}`} onClick={handleNavigate}>
                    <Image src={data.avatar} alt="avatar" className={cx('avatar')} />
                </Link>
                <Button className={cx('follow-btn', { following: follow })} primary onClick={handleFollowToggle}>
                    {follow ? 'Following' : 'Follow'}
                </Button>
            </div>
            <div className={cx('body')}>
                <Link to={`/profile/@${data.nickname}`} onClick={handleNavigate}>
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
    }),
};

export default memo(AccountPreview);
