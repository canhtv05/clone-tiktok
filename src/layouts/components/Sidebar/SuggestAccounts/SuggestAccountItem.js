import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './SuggestAccounts.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from './AccountPreview';
import Image from '~/components/Image';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';

const cx = classNames.bind(styles);

// chưa xử lý button onClick handle following
function SuggestAccountItem({ data }) {
    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data} />
                </PopperWrapper>
            </div>
        );
    };

    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
        dispatch(setNickName(`@${data.nickname}`));
        if (data?.id) {
            dispatch(setIdUser(data?.id));
        }
        dispatch(setMyAccount(false));
    }, [data?.id, data?.nickname, dispatch]);

    return (
        <div>
            <Tippy
                appendTo={document.body}
                interactive
                delay={[800, 0]}
                offset={[-20, 0]}
                placement="bottom"
                render={renderPreview}
            >
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
            </Tippy>
        </div>
    );
}

SuggestAccountItem.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        nickname: PropTypes.string.isRequired,
        tick: PropTypes.bool,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
    }).isRequired,
};
export default React.memo(SuggestAccountItem);
