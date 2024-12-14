import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './UploadPage.module.scss';

const cx = classNames.bind(styles);

function VideoSgtItem({ icon, title, desc }) {
    return (
        <div className={cx('video-suggested-item-container')}>
            <div className={cx('video-sgt-item')}>
                <span style={{ display: 'block', width: '100%', height: 'auto', color: 'var(--text-color)' }}>
                    {icon}
                </span>
            </div>
            <div className={cx('video-sgt-text')}>
                <div className={cx('video-sgt-title-container')}>
                    <p className={cx('sgt-text')}>{title}</p>
                </div>
                <div className={cx('video-sgt-desc')}>
                    <p className={cx('sgt-content')}>{desc}</p>
                </div>
            </div>
        </div>
    );
}

VideoSgtItem.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
};

export default memo(VideoSgtItem);
