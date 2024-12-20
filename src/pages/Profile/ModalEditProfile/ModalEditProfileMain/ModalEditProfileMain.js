import classNames from 'classnames/bind';
import styles from './ModalEditProfileMain.module.scss';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ModalEditProfileContext } from '../ModalEditProfileProvider';
import Button from '~/components/Button';
import { EditProfileIcon } from '~/components/Icons';
import images from '~/assets/images';
import ModalSuccess from '~/components/Modals/ModalSuccess';
import { updateCurrentUser } from '~/services/auth/updateCurrentUser';
import { useDispatch } from 'react-redux';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setBioCurrentUser } from '~/redux/slices/infoCurrentUserSlice';

const cx = classNames.bind(styles);

function ModalEditProfileMain() {
    const dispatch = useDispatch();
    const { imgCurrentUser, bio, fullName, setIsShowModal } = useContext(ModalEditProfileContext);

    const inputUploadRef = useRef();
    const inputFirstNameRef = useRef();
    const inputLastNameRef = useRef();
    const textareaBioRef = useRef();

    const spanFirstNameRef = useRef();
    const spanLastNameRef = useRef();
    const spanTextAreaRef = useRef();
    const [avatar, setAvatar] = useState(imgCurrentUser);
    const [fallback, setFallback] = useState('');
    const [isShowModalFormat, setIsShowModalFormat] = useState(false);
    const [isShowModalChangeInfo, setShowModalChangeInfo] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [lengthArea, setLengthArea] = useState(0);

    const token = localStorage.getItem('token');

    const regex = /^[a-zA-Z0-9_.]+$/;

    useEffect(() => {
        if (bio && fullName) {
            textareaBioRef.current.value = bio;
            const first = fullName.split(' ')[0];
            const last = fullName.split(' ')[1];
            inputFirstNameRef.current.value = first;
            inputLastNameRef.current.value = last;
            setLengthArea(bio.length);
        }

        setAvatar(imgCurrentUser);
    }, [bio, fullName, imgCurrentUser]);

    const handleUploadImg = () => {
        inputUploadRef.current.click();
    };

    const handleChangeImg = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (validTypes.includes(file.type)) {
                const preview = URL.createObjectURL(file);
                setAvatar(preview);
                setFallback('');
            } else {
                setIsShowModalFormat(true);
                setAvatar(imgCurrentUser);
                setFallback(images.noImage);
            }
        }
    };

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar);
        };
    }, [avatar]);

    const handleError = () => {
        setFallback(images.noImage);
    };

    const handleInputValid = (e, type, refSpanError) => {
        const value = e.target.value;

        if (value.length === 0 || value.startsWith(' ')) {
            setIsValid(false);
            if (type === 'bio') {
                setLengthArea(0);
            }
        } else if (value.length > 24 && (type === 'first name' || type === 'last name')) {
            refSpanError.current.textContent = 'Maximum 24 characters.';
            refSpanError.current.style.color = 'var(--primary)';
            e.target.style.border = '1px solid var(--primary)';
            setIsValid(false);
        } else if (!regex.test(value) && (type === 'first name' || type === 'last name')) {
            setIsValid(false);
            refSpanError.current.textContent = 'Only letters, numbers, underscores, and periods allowed.';
            refSpanError.current.style.color = 'var(--primary)';
            e.target.style.border = '1px solid var(--primary)';
        } else if (value.length > 80 && type === 'bio') {
            setIsValid(false);
            refSpanError.current.style.color = 'var(--primary)';
            e.target.style.border = '1px solid var(--primary)';
            return;
        } else {
            setIsValid(true);
            if (type !== 'bio') {
                refSpanError.current.textContent = `Enter your ${type}.`;
            }
            refSpanError.current.style.color = 'var(--opacity-text)';
            e.target.style.border = '1px solid var(--separate)';

            if (type === 'bio') {
                setLengthArea(value.length);
            }
        }

        const first = fullName.split(' ')[0];
        const last = fullName.split(' ')[1];

        if (type === 'bio') {
            if (bio === textareaBioRef.current.value) {
                setIsValid(false);
            }
        } else if (type === 'first name') {
            if (first === inputFirstNameRef.current.value) {
                setIsValid(false);
            }
        } else {
            if (last === inputLastNameRef.current.value) {
                setIsValid(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.target.value.length >= 80 && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    const handleBlur = (e) => {
        e.target.style.border = 'none';
    };

    const handleFocus = (e) => {
        e.target.style.border = '1px solid var(--separate)';
    };

    const handleSave = useCallback(async () => {
        const first_name = inputFirstNameRef.current.value;
        const last_name = inputLastNameRef.current.value;
        const bio = textareaBioRef.current.value;
        const avatar = inputUploadRef.current.files[0];
        const fullName = first_name + ' ' + last_name;

        await updateCurrentUser(first_name, last_name, avatar, bio, token);

        dispatch(setFullNameCurrentUser(fullName));
        dispatch(setBioCurrentUser(bio));
        setIsShowModal(false);
        setShowModalChangeInfo(true);
    }, [token, dispatch, setIsShowModal]);

    return (
        <div className={cx('container')}>
            <ModalSuccess
                title="Please upload a valid image (JPG, JPEG, PNG)."
                isShow={isShowModalFormat}
                setIsShow={setIsShowModalFormat}
            />
            <ModalSuccess title="Success." isShow={isShowModalChangeInfo} setIsShow={setIsShowModalFormat} />
            <div className={cx('img-container')}>
                <div className={cx('title')}>Profile photo</div>
                <div className={cx('edit-profile-avatar')}>
                    <div className={cx('img-wrapper')} onClick={handleUploadImg}>
                        <img
                            src={fallback || avatar}
                            alt="Profile Avatar"
                            className={cx('img')}
                            onError={handleError}
                        />
                    </div>
                    <div className={cx('upload-wrapper')}>
                        <Button
                            circle
                            midIcon={<EditProfileIcon />}
                            className={cx('button-change-img')}
                            onClick={handleUploadImg}
                        />
                        <input
                            type="file"
                            className={cx('upload-img-input')}
                            tabIndex={-1}
                            accept=".jpg,.jpeg,.png"
                            ref={inputUploadRef}
                            onChange={handleChangeImg}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>
            </div>
            <div className={cx('user-container')}>
                <div className={cx('title')}>First name</div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="text"
                        className={cx('my-input')}
                        onInput={(e) => handleInputValid(e, 'first name', spanFirstNameRef)}
                        ref={inputFirstNameRef}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                    <span className={cx('error-span')} ref={spanFirstNameRef}>
                        Enter your first name.
                    </span>

                    <span className={cx('error-span')}>
                        Only contain letters, numbers, underscores, and periods. Changing your username will also change
                        your profile link.
                    </span>
                </div>
            </div>
            <div className={cx('name-container')}>
                <div className={cx('title')}>Last name</div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="text"
                        className={cx('my-input')}
                        onInput={(e) => handleInputValid(e, 'last name', spanLastNameRef)}
                        ref={inputLastNameRef}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                    <span className={cx('error-span')} ref={spanLastNameRef}>
                        Enter your last name.
                    </span>
                </div>
            </div>
            <div className={cx('bio-container')}>
                <div className={cx('title')}>Bio</div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        type="text"
                        className={cx('my-input', { area: true })}
                        onInput={(e) => handleInputValid(e, 'bio', spanTextAreaRef)}
                        onKeyDown={handleKeyDown}
                        ref={textareaBioRef}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                    <span className={cx('error-span')}>
                        <span ref={spanTextAreaRef}>{lengthArea}</span> / 80
                    </span>
                </div>
            </div>
            <div className={cx('button-container', { button: true })}>
                <Button upload onClick={() => setIsShowModal(false)}>
                    Cancel
                </Button>
                <Button primary onClick={handleSave} disable={!isValid}>
                    Save
                </Button>
            </div>
        </div>
    );
}

export default ModalEditProfileMain;
