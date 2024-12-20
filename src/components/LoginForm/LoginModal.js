import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import { setLoginSuccess } from '~/redux/slices/loginSuccessSlice';
import LoginForm from './LoginForm';
import { createPortal } from 'react-dom';
import ModalSuccess from '../Modals/ModalSuccess';
import { setProfile } from '~/redux/slices/profileSlice';
import SignupForm from './SignupForm';

function LoginModal({ isShowModalLoginForm, setIsShowModalLoginForm }) {
    const loginSuccess = useSelector((state) => state.successLogin.successLogin);
    const dispatch = useDispatch();

    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const [isModalLogin, setIsModalLogin] = useState(true);

    useEffect(() => {
        if (loginSuccess) {
            setIsLoginSuccess(true);
        } else {
            setIsLoginSuccess(false);
        }
    }, [loginSuccess]);

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
                isShowModalLoginForm &&
                    (isModalLogin ? (
                        <LoginForm
                            onClose={handleClose}
                            onLoginSuccess={handleLoginSuccess}
                            onShowSignupForm={() => setIsModalLogin(false)}
                        />
                    ) : (
                        <SignupForm onClose={handleClose} onShowLoginForm={() => setIsModalLogin(true)} />
                    )),
                document.getElementById('root'),
            )}
            <ModalSuccess title="Logged in" isShow={isLoginSuccess} setIsShow={setIsLoginSuccess} />
        </>
    );
}

LoginModal.propTypes = {
    isShowModalLoginForm: PropTypes.bool.isRequired,
    setIsShowModalLoginForm: PropTypes.func.isRequired,
};

export default LoginModal;
