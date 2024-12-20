import classNames from 'classnames/bind';
import styles from './EditPageArticle.module.scss';
import Button from '~/components/Button';
import ModalSuccess from '~/components/Modals/ModalSuccess';
import { useState } from 'react';
import PageFeedEditPage from './PageFeedEditPage/PageFeedEditPage';
import { ScissorsIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const buttonConfigs = [
    { label: 'Feed', type: 'feed' },
    { label: 'Profile', type: 'profile' },
    { label: 'Web/TV', type: 'web' },
];

function EditPageArticle() {
    const [isShowMsgEdit, setIsShowMsgEdit] = useState(false);
    const [typePreview, setTypePreview] = useState('feed');

    return (
        <div className={cx('container')}>
            <div className={cx('mobile-preview-container')}>
                <div className={cx('button-tabs-container')}>
                    {buttonConfigs.map((button, index) => (
                        <Button
                            key={index}
                            height={26}
                            fontSize={14}
                            onClick={() => setTypePreview(button.type)}
                            className={cx('my-button', { active: typePreview === button.type })}
                        >
                            {button.label}
                        </Button>
                    ))}
                </div>
                <div className={cx('mobile-preview-main')}>{typePreview === 'feed' && <PageFeedEditPage />}</div>
                <div className={cx('button-edit-container')}>
                    <Button
                        upload
                        rounded
                        onClick={() => setIsShowMsgEdit(true)}
                        className={cx('btn-edit')}
                        height={40}
                        leftIcon={<ScissorsIcon />}
                    >
                        Edit video
                    </Button>
                </div>
            </div>
            <ModalSuccess isShow={isShowMsgEdit} setIsShow={setIsShowMsgEdit} delay={1200} title="Coming soon!" />
        </div>
    );
}

export default EditPageArticle;
