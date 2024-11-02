import classNames from 'classnames/bind';
import styles from './TikTokLoader.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function TikTokLoader({ top = 40, left = 50 }) {
    return (
        <div
            className={cx('tiktok-loader')}
            style={{ top: top + '%', left: left + '%', transform: `translate(-${top}%, -${left}%)` }}
        ></div>
    );
}

TikTokLoader.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
};

export default TikTokLoader;
