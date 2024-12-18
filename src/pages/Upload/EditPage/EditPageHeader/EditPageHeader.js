import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './EditPageHeader.module.scss';
import Button from '~/components/Button';
import { ReplaceIcon, UploadCloudIcon } from '~/components/Icons';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { UploadContext } from '../../UploadContext/UploadProvider';

const cx = classNames.bind(styles);

function EditPageHeader() {
    const { uploadedFile, textProgress, percent, isSuccess, handleClick, isReplace, setIsReplace } =
        useContext(UploadContext);

    const divProgressBarRef = useRef();

    useEffect(() => {
        if (divProgressBarRef.current) {
            if (isSuccess) {
                divProgressBarRef.current.style.background = `var(--success-color)`;
            } else {
                divProgressBarRef.current.style.background = `linear-gradient(90deg,  rgb(0, 117, 219) ${+percent}%, transparent 0)`;
            }
        }
    }, [percent, isSuccess]);

    const handleChangeVideo = useCallback(() => {
        if (isReplace) {
            handleClick();
        }
    }, [handleClick, isReplace]);

    return (
        <div className={cx('header-container', { 'has-replace': isReplace })} onClick={() => handleChangeVideo()}>
            {!isReplace ? (
                <>
                    <div className={cx('name-and-replace-container')}>
                        <span className={cx('title-name')}>{uploadedFile?.file?.name || ''}</span>
                        {isSuccess && (
                            <Button upload leftIcon={<ReplaceIcon />} onClick={() => setIsReplace(true)}>
                                Replace
                            </Button>
                        )}
                    </div>
                    <div className={cx('info-size-file-container')}>
                        <span>
                            <span className={cx('info-detail-item')}>
                                <span className={cx('info-label')}>Size: </span>
                                <span className={cx('info-detail-val')}>{uploadedFile?.size}</span>
                            </span>
                            <span className={cx('info-detail-item')}>
                                <span className={cx('info-label')}>Duration: </span>
                                <span className={cx('info-detail-val')}>{uploadedFile?.duration}</span>
                            </span>
                        </span>
                    </div>
                    <div className={cx('info-status-item')}>
                        {!isSuccess ? (
                            <>
                                <div className={cx('info-upload-container')}>
                                    <span className={cx('icon-upload')}>{percent !== null && <UploadCloudIcon />}</span>
                                    <span className={cx('current-uploaded-file')}>{textProgress}</span>
                                </div>
                                <div className={cx('percent-progress')}>{percent !== null ? percent + '%' : ''}</div>
                            </>
                        ) : (
                            <>
                                <div className={cx('info-upload-container')}>
                                    <FontAwesomeIcon className={cx('check-icon')} icon={faCheckCircle} />
                                    <span className={cx('current-uploaded-file', { success: isSuccess })}>
                                        Uploaded
                                    </span>
                                </div>
                                <div className={cx('percent-progress')}>100%</div>
                            </>
                        )}
                    </div>
                    <div className={cx('progress-bar')} ref={divProgressBarRef}></div>
                </>
            ) : (
                <div className={cx('upload-stage-container')}>
                    <div className={cx('icon-upload-stage')}>
                        <UploadCloudIcon />
                    </div>
                    <span className={cx('upload-text')}>Select video to upload</span>
                </div>
            )}
        </div>
    );
}

export default EditPageHeader;
