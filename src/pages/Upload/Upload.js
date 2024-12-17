import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import UploadPage from './UploadPage';
import { useContext } from 'react';
import EditPage from './EditPage';
import { UploadContext } from './UploadContext/UploadProvider';

const cx = classNames.bind(styles);

function Upload() {
    const { isShowModalEdit, inputVideoRef, handleChange, handleClick } = useContext(UploadContext);

    return (
        <div className={cx('container')}>
            {!isShowModalEdit ? (
                <div className={cx('wrapper-no-file')}>
                    <div className={cx('children-container')}>
                        <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            ref={inputVideoRef}
                            onChange={handleChange}
                        />
                        <UploadPage onClick={() => handleClick()} />
                    </div>
                </div>
            ) : (
                <div className={cx('wrapper-has-file')}>
                    <div className={cx('children-has-file-container')}>
                        <EditPage />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Upload;
