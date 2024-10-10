import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Image from '~/components/Image';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setProfile } from '~/redux/slices/profileSlice';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    const dispatch = useDispatch();
    const nickname = useSelector((state) => state.getNickname.nickname);

    const handleClick = () => {
        if (nickname !== `@${data.nickname}`) {
            dispatch(setProfile({}));
        }
        document.title = `${data.first_name} ${data.last_name} (@${data.nickname}) | TikTok`;
        // dispatch(setNickName(`@${data.nickname}`));
        dispatch(setMyAccount(false));
    };
    return (
        <Link to={`/profile/@${data.nickname}`} onClick={handleClick}>
            <div className={cx('account-item')}>
                <Image src={data.avatar} alt="avatar" className={cx('avatar')} />
                <div className={cx('item-info')}>
                    <p className={cx('nickname')}>
                        <strong className={cx('strong')}>{data.nickname}</strong>
                        {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                    </p>
                    <p className={cx('name')}>{`${data.first_name} ${data.last_name}`}</p>
                </div>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        nickname: PropTypes.string.isRequired,
        tick: PropTypes.bool,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
    }).isRequired,
    onclick: PropTypes.func,
};
export default React.memo(AccountItem);
