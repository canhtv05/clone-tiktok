import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import UploadPage from './UploadPage';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function Upload() {
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const inputVideoRef = useRef();

    useEffect(() => {
        if (inputVideoRef.current) {
            console.log(inputVideoRef.current.files[0]);
        }
    }, []);

    const handleClick = () => {
        inputVideoRef.current.click();
    };

    const handleChange = () => {
        if (inputVideoRef.current.files[0]) {
            console.log(inputVideoRef.current.files[0]);
            setIsShowModalEdit(true);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('children-container')}>
                    <input
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        ref={inputVideoRef}
                        onChange={handleChange}
                    />
                    {!isShowModalEdit && <UploadPage onClick={() => handleClick()} />}
                </div>
            </div>
        </div>
    );
}

export default Upload;
