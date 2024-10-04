import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './Message.module.scss';
import ModalSuccess from '~/components/ModalSuccess';
import Button from '~/components/Button';
import { DirectionArrowIcon, Setting2Icon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Message() {
    const [isShowModal, setIsShowModal] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowModal(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Button className={cx('btn-close')} circle midIcon={<DirectionArrowIcon />} />
            <div className={cx('list-account')}>
                <div className={cx('menu-header')}>
                    <h1 className={cx('title')}>Messages</h1>
                    <span>
                        <Setting2Icon className={cx('btn-setting')} />
                    </span>
                </div>
            </div>
            <div className={cx('chat-box')}></div>
            {isShowModal && <ModalSuccess title="Coming Soon!" />}
        </div>
    );
}

export default Message;
