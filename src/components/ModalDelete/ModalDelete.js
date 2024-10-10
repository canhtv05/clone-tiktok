import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ModalDelete.module.scss';

const cx = classNames.bind(styles);

function ModalDelete({ title, onDelete, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = (func) => {
        setIsVisible(false);
        func();
    };

    return (
        <div
            className={cx('wrapper')}
            onClick={(e) => {
                e.stopPropagation();
                handleClose(onClose);
            }}
        >
            <div className={cx('overlay')}></div>
            <div className={cx('wrapper-content', { show: isVisible })}>
                <div className={cx('title')}>{title}</div>
                <button className={cx('btn')} onClick={() => handleClose(onDelete)}>
                    <span style={{ color: 'var(--primary)' }}>Delete</span>
                </button>
                <button className={cx('btn', { close: true })} onClick={() => handleClose(onClose)}>
                    Close
                </button>
            </div>
        </div>
    );
}

ModalDelete.propTypes = {
    title: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    onClose: PropTypes.func,
};

export default ModalDelete;
