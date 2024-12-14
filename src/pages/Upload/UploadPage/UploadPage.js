import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './UploadPage.module.scss';
import { AspectRatiosIcon, CameraIcon, FileFormatIcon, UploadCloudIcon, VideoResolutionIcon } from '~/components/Icons';
import Button from '~/components/Button';
import VideoSgtItem from './VideoSgtItem';

const cx = classNames.bind(styles);

function UploadPage({ onClick }) {
    return (
        <>
            <div className={cx('select-video-container')} onClick={() => onClick()}>
                <div className={cx('upload-stage-container')}>
                    <div className={cx('upload-card-icon')}>
                        <UploadCloudIcon />
                    </div>
                    <div className={cx('upload-text-container')}>
                        <div className={cx('select-text')}>Select video to upload</div>
                        <Button primary className={cx('button-select')}>
                            <span>Select video</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className={cx('video-suggestion-container')}>
                <VideoSgtItem
                    icon={<CameraIcon />}
                    title="Size and duration"
                    desc="Maximum size: 2 GB, video duration: 5 minutes."
                />
                <VideoSgtItem
                    icon={<FileFormatIcon />}
                    title="File formats"
                    desc="Recommended: “.mp4”. Other major formats are supported."
                />
                <VideoSgtItem
                    icon={<VideoResolutionIcon />}
                    title="Video resolutions"
                    desc="Minimum resolution: 720p. 2K and 4K are supported."
                />
                <VideoSgtItem
                    icon={<AspectRatiosIcon />}
                    title="Aspect ratios"
                    desc="Recommended: 16:9 for landscape, 9:16 for vertical."
                />
            </div>
        </>
    );
}

UploadPage.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default UploadPage;
