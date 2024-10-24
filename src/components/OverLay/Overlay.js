import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Overlay.module.scss';

const cx = classNames.bind(styles);

function Overlay({ children, isShowModal }) {
    return (
        <div className={cx('overlay', { show: isShowModal })}>
            <div className={cx('center-wrapper')}>{children}</div>
        </div>
    );
}

Overlay.propTypes = {
    children: PropTypes.node.isRequired,
    isShowModal: PropTypes.bool.isRequired,
};

export default Overlay;
