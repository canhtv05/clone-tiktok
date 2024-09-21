import React, { memo, useCallback, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './LoginForm.module.scss';
import { CloseIcon, NextVideoIcon } from '../Icons';
import Button from '../Button';
import { login } from '~/services/login';
import { getCurrentUser } from '~/services/getCurrentUser';
import { setCurrentUser } from '~/redux/slices/currentUserSlice';
import { setLoginSuccess } from '~/redux/slices/loginSuccessSlice';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setInfoCurrentUser } from '~/redux/slices/infoCurrentUserSlice';

const cx = classNames.bind(styles);

function LoginFormItem({ onClose, onBack, onLoginSuccess }) {
    const [email, setEmail] = useState('r@gmail.com');
    const [password, setPassword] = useState('12345678A@');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hideButton, setHideButton] = useState(true);
    const [typePassword, setTypePassWord] = useState('password');
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();

    const handleEmail = useCallback(() => {
        const regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const emailValue = emailRef.current.value;

        if (!emailValue || emailValue.trim() === '') {
            setEmailError('Please enter your email');
        } else if (!regexEmail.test(emailValue)) {
            setEmailError('Please enter correct email format. Ex: abc@gmail.com');
        } else {
            setEmailError('');
        }
    }, []);

    const handlePassword = useCallback(() => {
        const regexPassword = /^(?=.*\d)(?=.*[A-Z-a-z]).+$/;
        const passwordValue = passwordRef.current.value;

        if (!passwordValue || passwordValue.trim() === '') {
            setPasswordError('Please enter your password');
        } else if (!regexPassword.test(passwordValue)) {
            setPasswordError('Password must contain at least numbers and letters');
        } else if (passwordValue.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError('');
        }
    }, []);

    const handleClose = () => {
        onClose();
    };

    const handleBack = () => {
        onBack();
    };

    const handleShow = useCallback(() => {
        setHideButton(false);
        setTypePassWord('text');
    }, []);

    const handleHide = useCallback(() => {
        setHideButton(true);
        setTypePassWord('password');
    }, []);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        handleEmail();
        handlePassword();

        if (emailError || passwordError) {
            return;
        }

        try {
            setIsLoading(true);
            const token = await login(email, password);
            const currentUser = await getCurrentUser(token);
            dispatch(setCurrentUserImageSlice(currentUser.data.avatar));
            dispatch(setCurrentUser(currentUser.data.nickname));

            if (currentUser?.data?.first_name && currentUser?.data?.last_name) {
                dispatch(
                    setFullNameCurrentUser(
                        `${currentUser.first_name} ${currentUser.last_name || currentUser.nickname}`,
                    ),
                );
                dispatch(
                    setInfoCurrentUser({
                        bio: `${currentUser.bio}`,
                        followers: `${currentUser.followers_count || '0'}`,
                        likes: `${currentUser.likes_count}`,
                    }),
                );
            }

            if (token) {
                dispatch(setLoginSuccess(true));
                navigate('/');
                onClose();
                onLoginSuccess();
            }
        } catch (error) {
            localStorage.removeItem('token');
            setEmailError('Login failed. Please check your information again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {isLoading && <div className={cx('tiktok-loader')}></div>}
            <div onClick={handleClose} className={cx('overlay-2')}></div>
            <div className={cx('login-container')}>
                <div className={cx('modal-content')}>
                    <div className={cx('div-login')}>
                        <div className={cx('div-home-container')}>
                            <h2 className={cx('login-title')}>Log in</h2>
                            <div className={cx('wrapper-form')}>
                                <form onSubmit={handleSubmit} className={cx('login-form')}>
                                    <h3 className={cx('title-login')}>Login with your email</h3>
                                    <div className={cx('input-group')}>
                                        <input
                                            ref={emailRef}
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cx('input', { error: emailError })}
                                            onBlur={handleEmail}
                                            onInput={handleEmail}
                                        />
                                    </div>
                                    <div className={cx('error-email')}>{emailError}</div>
                                    <div className={cx('input-group')}>
                                        <div className={cx('input-container')}>
                                            <input
                                                ref={passwordRef}
                                                type={typePassword}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={cx('input', { error: passwordError })}
                                                onBlur={handlePassword}
                                                onInput={handlePassword}
                                            />
                                            <div className={cx('icon-button')}>
                                                {!hideButton && (
                                                    <Button className={cx('hide')} onClick={handleHide}>
                                                        <FontAwesomeIcon icon={faEyeSlash} />
                                                    </Button>
                                                )}
                                                {hideButton && (
                                                    <Button className={cx('show')} onClick={handleShow}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('error-password')}>{passwordError}</div>
                                    <Button
                                        primary
                                        type="submit"
                                        className={cx('submit-button', { error: passwordError || emailError })}
                                    >
                                        Log In
                                    </Button>
                                    <div className={cx('forgot-password')}>Forgot password?</div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={cx('register')}>
                        <div className={cx('dont-account')}>Don’t have an account?</div>
                        <Link to={'/'}>
                            <span className={cx('span-link')}>Sign up</span>
                        </Link>
                    </div>
                </div>
                <Button onClick={handleClose} className={cx('button-close')} midIcon={<CloseIcon />} circle></Button>
                <Button onClick={handleBack} className={cx('button-prev')} midIcon={<NextVideoIcon />} circle></Button>
            </div>
        </div>
    );
}

LoginFormItem.propTypes = {
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default memo(LoginFormItem);
