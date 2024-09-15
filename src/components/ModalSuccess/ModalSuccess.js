import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './ModalSuccess.module.scss';
import { memo } from 'react';

const cx = classNames.bind(styles);

function ModalSuccess({ title }) {
    return (
        <div className={cx('modal-success')}>
            <div className={cx('notice')}>
                <div className={cx('notice-content')}>
                    <div className={cx('message')}>
                        <span>{title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

ModalSuccess.propTypes = {
    title: PropTypes.string,
};

export default memo(ModalSuccess);
