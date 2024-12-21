import classNames from 'classnames/bind';
import styles from './EditPageDetailsAside.module.scss';
import { HashtagsIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function EditPageDetailsAside() {
    return (
        <div className={cx('container')}>
            <div className={cx('title')}>Details</div>
            <div className={cx('card')}>
                <div className={cx('description-container')}>
                    <div className={cx('caption-title')}>
                        <span style={{ fontSize: '14px' }}>Description</span>
                    </div>
                    <div className={cx('caption-markup')}>
                        <textarea className={cx('caption-editor')}></textarea>
                        <div className={cx('caption-toolbar')}>
                            <div className={cx('operation-button')}>
                                <button className={cx('hashtag-btn')}>
                                    <HashtagsIcon />
                                    <span className={cx('operation-title')}>Hashtags</span>
                                </button>
                            </div>
                            <div className={cx('word-count')}>111/1000</div>
                        </div>
                    </div>
                </div>

                <div className={cx('cover')}>
                    <div className={cx('caption-title')}>
                        <span className={cx('cover-title')}>Cover</span>
                    </div>
                    <div className={cx('cover-container')}>
                        <img src="" alt="" />
                        <div className={cx('edit-container')}>Edit cover</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPageDetailsAside;
