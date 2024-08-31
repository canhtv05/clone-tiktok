import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function AccountPreview({ data }) {
    const [follow, setFollow] = useState(false);

    useEffect(() => {
        const followingList = JSON.parse(localStorage.getItem('following')) || [];

        if (Array.isArray(followingList)) {
            setFollow(followingList.includes(data.id));
        }
    }, [data.id]);

    const handleFollow = () => {
        setFollow((prev) => {
            const newFollow = !prev;
            let followingList = JSON.parse(localStorage.getItem('following')) || [];

            if (!Array.isArray(followingList)) {
                followingList = [];
            }

            if (newFollow) {
                if (!followingList.includes(data.id)) {
                    followingList.push(data.id);
                }
            } else {
                followingList = followingList.filter((id) => id !== data.id);
            }

            localStorage.setItem('following', JSON.stringify(followingList));

            return newFollow;
        });
    };

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Image src={data.avatar} alt="avatar" className={cx('avatar')} />
                <Button className={cx('follow-btn', { following: follow })} primary onClick={handleFollow}>
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

export default AccountPreview;
