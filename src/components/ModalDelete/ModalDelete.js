import classNames from 'classnames/bind';
import styles from './ModalDelete.module.scss';
import { useState, useEffect } from 'react';

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
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={() => handleClose(onClose)}></div>
            <div className={cx('wrapper-content', { show: isVisible })}>
                <div className={cx('title')}>{title}</div>
                <button className={cx('btn')} onClick={() => handleClose(onDelete)}>
                    Delete
                </button>
                <button className={cx('btn', { close: true })} onClick={() => handleClose(onClose)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default ModalDelete;
