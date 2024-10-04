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
import { BrokenHeartIcon, EllipsisIcon, FlagIcon } from '../Icons';
import { setProfile } from '~/redux/slices/profileSlice';
import TippyEllipsis from '../TippyEllipsis';

const cx = classNames.bind(styles);

const menuItem = [
    {
        title: 'Report',
        icon: <FlagIcon />,
        separate: true,
    },
    {
        title: 'Mark as irrelevant',
        icon: <BrokenHeartIcon />,
        separate: false,
    },
];

function AccountItem({ data, onClick, threeDot = false }) {
    const dispatch = useDispatch();
    const nickname = localStorage.getItem('nickname');

    const handleClick = () => {
        onClick();
        if (nickname !== `@${data.nickname}`) {
            dispatch(setProfile({}));
        }
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
            {threeDot && (
                <TippyEllipsis menuItem={menuItem} offsetX={-80} offsetY={5} delayIn={0} delayOut={0} hoverRed>
                    <span className={cx('ellipsis')}>
                        <EllipsisIcon width="1.5rem" height="1.5rem" />
                    </span>
                </TippyEllipsis>
            )}
        </Link>
    );
}
AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default AccountItem;
