import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './EditPageHeader.module.scss';
import Button from '~/components/Button';
import { ReplaceIcon, UploadCloudIcon } from '~/components/Icons';
import { useContext } from 'react';
import { UploadContext } from '../../UploadContext/UploadProvider';

const cx = classNames.bind(styles);

function EditPageHeader() {
    const { uploadedFile, textProgress, percent, isSuccess } = useContext(UploadContext);

    return (
        <div className={cx('header-container', { success: isSuccess })}>
            <div className={cx('name-and-replace-container')}>
                <span className={cx('title-name')}>{uploadedFile?.file?.name || ''}</span>
                <Button upload leftIcon={<ReplaceIcon />}>
                    Replace
                </Button>
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
                            <span className={cx('icon-upload')}>
                                <UploadCloudIcon />
                            </span>
                            <span className={cx('current-uploaded-file')}>{textProgress}</span>
                        </div>
                        <div className={cx('percent-progress')}>{percent}%</div>
                    </>
                ) : (
                    <>
                        <div className={cx('info-upload-container')}>
                            <FontAwesomeIcon className={cx('check-icon')} icon={faCheckCircle} />
                            <span className={cx('current-uploaded-file', { success: isSuccess })}>Uploaded</span>
                        </div>
                        <div className={cx('percent-progress')}>100%</div>
                    </>
                )}
            </div>
            {isSuccess && <div className={cx('progress-bar')}></div>}
        </div>
    );
}

export default EditPageHeader;
