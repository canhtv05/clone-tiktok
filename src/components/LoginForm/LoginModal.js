import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { setLoginSuccess } from '~/redux/slices/loginSuccessSlice';
import LoginForm from './LoginForm';
import { createPortal } from 'react-dom';
import ModalSuccess from '../ModalSuccess';
import { setProfile } from '~/redux/slices/profileSlice';

function LoginModal({ isShowModalLoginForm, setIsShowModalLoginForm }) {
    const loginSuccess = useSelector((state) => state.successLogin.successLogin);
    const dispatch = useDispatch();

    useEffect(() => {
        if (loginSuccess) {
            const timer = setTimeout(() => {
                dispatch(setLoginSuccess(false));
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [dispatch, loginSuccess]);

    useEffect(() => {
        setIsShowModalLoginForm(isShowModalLoginForm);
    }, [isShowModalLoginForm, setIsShowModalLoginForm]);

    const handleLoginSuccess = useCallback(() => {
        dispatch(setLoginSuccess(true));
        setIsShowModalLoginForm(false);
        dispatch(setProfile({}));
    }, [dispatch, setIsShowModalLoginForm]);

    const handleClose = useCallback(() => {
        setIsShowModalLoginForm(false);
    }, [setIsShowModalLoginForm]);

    return (
        <>
            {createPortal(
                isShowModalLoginForm && <LoginForm onClose={handleClose} onLoginSuccess={handleLoginSuccess} />,
                document.getElementById('root'),
            )}
            {loginSuccess && <ModalSuccess title="Logged in" />}
        </>
    );
}

LoginModal.propTypes = {
    isShowModalLoginForm: PropTypes.bool.isRequired,
    setIsShowModalLoginForm: PropTypes.func.isRequired,
};

export default LoginModal;
