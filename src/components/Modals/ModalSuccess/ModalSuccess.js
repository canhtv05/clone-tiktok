import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './ModalSuccess.module.scss';
import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

const cx = classNames.bind(styles);

function ModalSuccess({ title, leftIcon = false, icon, isShow, delay = 1000, setIsShow }) {
    useEffect(() => {
        if (isShow) {
            const timer = setTimeout(() => {
                setIsShow(false);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [isShow, setIsShow, delay]);

    return (
        <div className={cx('modal-success', { show: isShow, hide: !isShow })}>
            <div className={cx('notice')}>
                <div className={cx('notice-content')}>
                    <div className={cx('message')}>
                        <span
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <span
                                style={{
                                    marginRight: '4px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {leftIcon && icon}
                            </span>
                            {title}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

ModalSuccess.propTypes = {
    title: PropTypes.string.isRequired,
    leftIcon: PropTypes.bool,
    icon: PropTypes.node,
    isShow: PropTypes.bool.isRequired,
    setIsShow: PropTypes.func.isRequired,
    delay: PropTypes.number,
};

export default memo(ModalSuccess);
