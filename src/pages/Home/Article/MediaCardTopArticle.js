import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { useCallback, useState, useRef, useEffect } from 'react';

import Button from '~/components/Button';
import TippyEllipsis from '~/components/TippyEllipsis';
import { NotVolumeIcon, VolumeIcon, ScrollIcon, BrokenHeartIcon, FlagIcon, EllipsisIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const menuItem = [
    {
        title: 'Auto scroll',
        icon: <ScrollIcon />,
        separate: true,
        toggle: true,
    },
    {
        title: 'Not interested',
        icon: <BrokenHeartIcon />,
        separate: true,
    },
    {
        title: 'Report',
        icon: <FlagIcon />,
        separate: false,
    },
];

function MediaCardTopArticle({ videoRef, seekBarRef }) {
    const volumeRef = useRef();
    const [volume, setVolume] = useState(50);
    const [previousVolume, setPreviousVolume] = useState(50);

    // âm thanh hiện tại max = 1
    useEffect(() => {
        if (videoRef.current) {
            volumeRef.current.style.background = `linear-gradient(90deg, #fff ${volume}%, transparent 0)`;
            videoRef.current.volume = volume / 100;
        }
        seekBarRef.current.value = 0;
    }, [volume, seekBarRef, videoRef]);

    const handleOnInputVolume = useCallback(() => {
        const newVolume = volumeRef.current.value;
        volumeRef.current.style.background = `linear-gradient(90deg, #fff ${+newVolume}%, transparent 0)`;
        setVolume(newVolume);
        setPreviousVolume(newVolume);
    }, []);

    const handleNoVolume = useCallback(() => {
        if (volume <= 0) {
            setVolume(previousVolume <= 0 ? 50 : previousVolume);
            volumeRef.current.style.background = `linear-gradient(90deg, #fff ${+previousVolume}%, transparent 0)`;
        } else {
            setPreviousVolume(volume);
            volumeRef.current.style.background = `linear-gradient(90deg, #fff 0%, transparent 0)`;
            setVolume(0);
        }
    }, [volume, previousVolume]);

    return (
        <div className={cx('media-card-top')}>
            <div className={cx('media-controls-top')}>
                <div className={cx('volume-container')}>
                    <span className={cx('icon-volume')}>
                        <Button
                            onClick={handleNoVolume}
                            className={cx('volume')}
                            circle
                            midIcon={volume <= 0 ? <NotVolumeIcon /> : <VolumeIcon />}
                        />
                    </span>
                    <div className={cx('volume-wrapper')}>
                        <input
                            ref={volumeRef}
                            min={0}
                            max={100}
                            step={1}
                            className={cx('volume-progress')}
                            type="range"
                            value={volume}
                            onInput={handleOnInputVolume}
                        />
                    </div>
                </div>
                <div className={cx('icon-ellipsis')}>
                    <TippyEllipsis menuItem={menuItem} position="right" offsetX={40} offsetY={30}>
                        <span className={cx('ellipsis')}>
                            <EllipsisIcon style={{ color: '#fff' }} />
                        </span>
                    </TippyEllipsis>
                </div>
            </div>
        </div>
    );
}

MediaCardTopArticle.propTypes = {
    videoRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLVideoElement),
    }).isRequired,
    seekBarRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLInputElement),
    }).isRequired,
};

export default MediaCardTopArticle;
