import React, { memo, useCallback, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './LoginForm.module.scss';
import { CloseIcon, NextVideoIcon } from '../Icons';
import Button from '../Button';
import TikTokLoader from '../TikTokLoader';
import { register } from '~/services/register';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SignupFormItem({ onClose, onBack, onShowLoginForm, setIsSignupSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hideButton, setHideButton] = useState(true);
    const [typePassword, setTypePassWord] = useState('password');
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleEmail = () => {
        const regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const emailValue = emailRef.current.value;

        if (!emailValue || emailValue.trim() === '') {
            setEmailError('Please enter your email');
        } else if (!regexEmail.test(emailValue)) {
            setEmailError('Please enter correct email format. Ex: abc@gmail.com');
        } else {
            setEmailError('');
        }
    };

    const handlePassword = () => {
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
    };

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleBack = useCallback(() => {
        onBack();
    }, [onBack]);

    const handleShow = () => {
        setHideButton(false);
        setTypePassWord('text');
    };

    const handleHide = () => {
        setHideButton(true);
        setTypePassWord('password');
    };

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            handleEmail();
            handlePassword();

            if (emailError || passwordError) {
                return;
            }

            setIsLoading(true);
            const { data, statusCode } = await register(email, password);

            if (!data) {
                if (statusCode === 401) {
                    setEmailError('Unauthorized. Please check your email or password.');
                } else if (statusCode === 500) {
                    setEmailError('Server error. Please try again later.');
                } else if (statusCode === 409) {
                    setEmailError('Conflict user. Please try again.');
                } else {
                    setEmailError('Sign up failed. Please check your information again.');
                }
            } else {
                setIsSignupSuccess(true);
                onBack();
            }
            setIsLoading(false);
        },
        [email, emailError, password, passwordError, onBack, setIsSignupSuccess],
    );

    return (
        <div className={cx('wrapper')}>
            {isLoading && <TikTokLoader />}
            <div onClick={handleClose} className={cx('overlay-2')}></div>
            <div className={cx('login-container')}>
                <div className={cx('modal-content')}>
                    <div className={cx('div-login')}>
                        <div className={cx('div-home-container')}>
                            <h2 className={cx('login-title')}>Sign up</h2>
                            <div className={cx('wrapper-form')}>
                                <form onSubmit={handleSubmit} className={cx('login-form')}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3 className={cx('title-login')} style={{ fontSize: '15px' }}>
                                            Email
                                        </h3>
                                        <h3 className={cx('title-login')}>Sig up with your email</h3>
                                    </div>
                                    <div className={cx('input-group')}>
                                        <input
                                            ref={emailRef}
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cx('input', { error: emailError })}
                                            onBlur={handleEmail}
                                            onInput={handleEmail}
                                            id="email"
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
                                                id="password"
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
                                        Sign up
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={cx('policy-confirm')}>
                        <p className={cx('text')}>
                            By continuing with an account located in
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' VietNam'}</strong>
                            </Link>
                            , you agree to our
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' Terms of Service '}</strong>
                            </Link>
                            and acknowledge that you have read our
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' Privacy Policy'}</strong>
                            </Link>
                        </p>
                    </div>
                    <div className={cx('register')}>
                        <div className={cx('dont-account')}>Already have an account?</div>
                        <div onClick={onShowLoginForm} style={{ cursor: 'pointer' }}>
                            <span className={cx('span-link')}>Log in</span>
                        </div>
                    </div>
                </div>
                <Button onClick={handleClose} className={cx('button-close')} midIcon={<CloseIcon />} circle></Button>
                <Button onClick={handleBack} className={cx('button-prev')} midIcon={<NextVideoIcon />} circle></Button>
            </div>
        </div>
    );
}

SignupFormItem.propTypes = {
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    setIsSignupSuccess: PropTypes.func,
};

export default memo(SignupFormItem);
