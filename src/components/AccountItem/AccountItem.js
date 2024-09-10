import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import styles from './AccountItem.module.scss';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setMyAccount } from '~/redux/slices/myAccountSlice';

const cx = classNames.bind(styles);

function AccountItem({ data, onClick }) {
    const dispatch = useDispatch();

    const handleClick = () => {
        onClick();
        dispatch(setNickName(`@${data.nickname}`));
        dispatch(setMyAccount(false));
    };

    return (
        <Link to={`/profile/@${data.nickname}`} className={cx('wrapper')} onClick={handleClick}>
            <Image className={cx('avatar')} src={data.avatar} alt={data.full_name} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.full_name}</span>
                    {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                </h4>
                <span className={cx('username')}>{data.nickname}</span>
            </div>
        </Link>
    );
}
AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default AccountItem;
