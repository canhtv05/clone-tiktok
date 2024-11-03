import { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Article.module.scss';
const cx = classNames.bind(styles);

function SeekBarArticle({
    currentTime,
    duration,
    isMouseDown,
    isMouseMove,
    videoRef,
    seekBarRef,
    setIsMouseMove,
    setIsMouseDown,
    isWaiting,
}) {
    const handleOnInputVideo = () => {
        const seekBar = seekBarRef.current;
        const newTime = (seekBar.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        const value = seekBar.value;
        seekBar.style.background = `linear-gradient(90deg, var(--primary) ${+value}%, transparent 0)`;
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isWaiting) {
                e.stopPropagation();
                setIsMouseMove(true);
                videoRef.current.pause();
            }
        },
        [isWaiting, setIsMouseMove, videoRef],
    );

    const handleMouseDown = useCallback(
        (e) => {
            if (!isWaiting) {
                e.stopPropagation();
                setIsMouseDown(true);
                videoRef.current.pause();
            }
        },
        [isWaiting, setIsMouseDown, videoRef],
    );

    const handleMouseOver = useCallback(() => {
        if (!isWaiting) {
            setIsMouseDown(false);
            setIsMouseMove(false);
            videoRef.current.pause();
        }
    }, [isWaiting, setIsMouseDown, setIsMouseMove, videoRef]);

    const handleMouseLeaveInputRange = () => {
        setIsMouseDown(false);
        setIsMouseMove(false);

        if (videoRef.current.paused && videoRef) {
            videoRef.current.play().catch((error) => {
                return;
            });
        }
    };

    const formattedTime = useMemo(() => {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        return formatTime(currentTime || 0) + ' / ' + formatTime(duration || 0);
    }, [currentTime, duration]);

    return (
        <div className={cx('seek-bar-container')}>
            {isMouseDown && isMouseMove && <p className={cx('timing')}>{formattedTime}</p>}
            <div className={cx('seek-bar')}>
                <div className={cx('div-seek-bar')}>
                    <input
                        onInput={handleOnInputVideo}
                        ref={seekBarRef}
                        min={0}
                        max={100}
                        step={1}
                        type="range"
                        className={cx('progress')}
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveInputRange}
                        onMouseOver={handleMouseOver}
                    />
                </div>
            </div>
        </div>
    );
}

SeekBarArticle.propTypes = {
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    isMouseDown: PropTypes.bool.isRequired,
    isMouseMove: PropTypes.bool.isRequired,
    videoRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLVideoElement),
    }).isRequired,
    seekBarRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLInputElement),
    }),
    setIsMouseMove: PropTypes.func.isRequired,
    setIsMouseDown: PropTypes.func.isRequired,
};

export default memo(SeekBarArticle);
