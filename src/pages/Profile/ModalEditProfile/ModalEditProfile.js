import classNames from 'classnames/bind';
import styles from './ModalEditProfile.module.scss';
import Overlay from '~/components/OverLay';
import ModalEditProfileProvider from './ModalEditProfileProvider';
import { CloseIcon } from '~/components/Icons';
import ModalEditProfileMain from './ModalEditProfileMain';

const cx = classNames.bind(styles);

function ModalEditProfile({ isShowModal, setIsShowModal }) {
    return (
        <Overlay isShowModal={isShowModal}>
            <div className={cx('container', { show: isShowModal, hide: !isShowModal })}>
                <div style={{ height: 700 }}>
                    <ModalEditProfileProvider setIsShowModal={setIsShowModal}>
                        <div className={cx('header')}>
                            <h1 className={cx('header-title')}>Edit profile</h1>
                            <div
                                onClick={() => setIsShowModal(false)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 5,
                                    cursor: 'pointer',
                                }}
                            >
                                <CloseIcon />
                            </div>
                        </div>
                        <ModalEditProfileMain />
                    </ModalEditProfileProvider>
                </div>
            </div>
        </Overlay>
    );
}

export default ModalEditProfile;
