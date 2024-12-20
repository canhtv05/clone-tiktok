import classNames from 'classnames/bind';
import styles from './LogoutModal.module.scss';
import Overlay from '~/components/OverLay';
import Button from '~/components/Button';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/services/auth/logout';
import { useDispatch } from 'react-redux';
import { setListsVideoHome } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

function LogoutModal({ isShow, setIsShow }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const divRef = useRef();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (divRef.current && !divRef.current.contains(e.target)) {
                setIsShow(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);

        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [setIsShow]);

    const handleLogout = useCallback(async () => {
        if (token) {
            await logout(token);
            localStorage.removeItem('token');
        }
        navigate('/');
        dispatch(setListsVideoHome([]));
        setIsShow(false);
    }, [token, navigate, setIsShow, dispatch]);

    return (
        <Overlay isShowModal={isShow}>
            <div className={cx('container', { show: isShow, hide: !isShow })} ref={divRef}>
                <div className={cx('confirm-title')}>Are you sure you want to log out?</div>
                <div className={cx('button-container')}>
                    <Button upload className={cx('btn-cancel')} onClick={() => setIsShow(false)}>
                        Cancel
                    </Button>
                    <Button primary outline className={cx('btn-logout')} onClick={handleLogout}>
                        Log out
                    </Button>
                </div>
            </div>
        </Overlay>
    );
}

export default LogoutModal;
